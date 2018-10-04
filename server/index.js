"use strict";
const MESSAGE_HISTORY_MAX = 50;
const REDIS_MESSAGE_CACHE_NAME = "message_history";
const WebSocket = require('ws');
const server = new WebSocket.Server({
        port: 12345,
    });

const redisClient = require('redis').createClient;
const redis = redisClient();
const mongo = require('mongodb');
const mongoClient = mongo.MongoClient;
const mongoUrl = "mongodb://localhost:27017";

var StringUtils = require('./utils/StringUtils.js');

function broadcast (data) {
    server.clients.forEach(ws => {
        ws.send(JSON.stringify(data));
    });
}

function showMessageHistory(ws) {
    redis.lrange(REDIS_MESSAGE_CACHE_NAME, 0, MESSAGE_HISTORY_MAX, (err, reply) => {
        if (err) {
            console.log("Error: ", err);
            // Delegate to Mongo to retrieve history, if for some reason we can't retrieve from Redis
            showMessageHistoryMongo(ws);
        } else {
            reply.reverse().forEach((message) => {
                ws.send(message);
            })
        }
    })
}

// In an ideal world, this would rarely get called as our Redis instance would be always up.
function showMessageHistoryMongo(ws) {
    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, (err, db) => {
        if (err) {
            console.log("Unable to connect to MongoDB server", err);
        } else {
            let dbo = db.db("local");
            dbo.collection('messages', (err, collection) => {
                if (err) {
                    console.log("Error when showing message history: ", err);
                }
                // What's really nice about this is that it returns messages in reverse chronological order.
                let messageHistory = collection.find().skip(collection.countDocuments() - MESSAGE_HISTORY_MAX);
                messageHistory.forEach((message) => {
                    ws.send(JSON.stringify(message));
                })
            });
        }
    });
}

function insertToMongoDB(data) {
    mongoClient.connect(mongoUrl, {useNewUrlParser: true}, (err, db) => {
        if (err) {
            throw err;
        }
        let dbo = db.db("local");
        dbo.collection('messages', (err, collection) => {
            collection.insertOne(data, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    db.close();
                }
            })
        })
    });
};

function insertToRedisCache(data) {
    redis.lpush(REDIS_MESSAGE_CACHE_NAME, JSON.stringify(data));
    redis.ltrim(REDIS_MESSAGE_CACHE_NAME, 0, MESSAGE_HISTORY_MAX)
}


server.on('connection', ws => {
    let stringUtils = new StringUtils();
    showMessageHistory(ws);
    ws.on('message', data => {
        data = JSON.parse(data);
        if (data.type == "name") {
            // This is handled client side. When sending a message, the name that the user chose is passed alongside the request.
            return;
        } else {
            let badWords = stringUtils.getBadWords();
            data.msg = stringUtils.sanitizeMessage(data.msg, new RegExp("/\b" + badWords.join("|") + "/\b", "gi"));
            insertToRedisCache(data);
            insertToMongoDB(data);
        }
        broadcast(data);
    });
});