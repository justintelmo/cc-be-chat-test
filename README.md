Node.js Chat Room
_____
A simple implementation by Justin Telmo.


To run server:

```
cd server/
npm install
node index.js
```

You must have Redis and MongoDB installed in order to run this.

To run client:
Point your browser at the client/index.html file.


Design considerations: 

The packages I used in this project were:

```
ws
mongodb
mongoose
redis-node
fs
ava
sinon
```

ws was given as the only socket package I could use. MongoDB and Mongoose were used for their flexibility and ease of implementation. The redis-node package was used simply to implement the caching solution that would give us a much better time per query. The fs package was used for parsing the banned_words.txt file inside of the `server` directory. Finally, Ava and Sinon were used as packages for the testing suite I was working on. Sinon was originally used for mocking, but I could not figure out how to get it to work with this in time.

I implemented this chat room using the ws package. I utilized the ws package to send a payload containing an object of schema:

```
id, sender, message
```

Then stored it in both redis and mongoDB. The storage in redis was kept updated to the last 50 messages using `LPUSH` and `LTRIM`. This would act as the mechanism for storing the chat history when a new user connects. Redis was taken into consideration for both scaling and performance purposes. There was a little learning curve as far as storing different things in Redis, but it was not hard. Since we cared about order of the messages, we needed to use a `LIST` instead of a `SET`. When grabbing messages from the MongoDB instance, we actually leveraged the fact that the id has an inherent timestamp located inside of it to sort messages.

Originally, I had implemented a Trie data structure for attempting to censor words, but it seemed to be futile as it would only catch words if they were explicitly found in the message. In order to achieve a more 'believable' filter, I instead opted to go for a RegExp solution which essentially took every word in the list of banned_words (stored locally) and concatenated them with a |. This would create the filter I would use to censor words, which means we could censor in place (take the example of "hellboy" becoming "[CENSORED]boy"). The tradeoff here is performance, which I deemed to not be too bad since our list of banned words was < 1k. The Trie actually had a comparable run-time (O(n) to my knowledge, to traverse the Trie in search) but the RegExp was much simpler to implement and did not an additional data-structure. A trie would be better used for say, domain pattern-matching, where we are forced to scan from the beginning and do not care about any sub-strings.

Client-side I ran into a couple corner cases involving empty names and empty messages. I went around both of those inside the ws-client.js file, they are not hard to get around but they are there. I did not have time to make the app look as pretty as I wanted. 

As far as scaling concerns go, I'm not sure how well Redis would hold up to millions of users hitting this at once. There's a chance that the Redis and/or Mongo instances could get overloaded, and I did not have time to implement a more efficient caching solution for this project. The biggest concern is the fact that I have not sufficiently limited the message or name length. Those would be two areas that would be targeted for exploitation first. However, given enough time I would surely implement this.

As far as testing goes, I was almost completely lost. I knew what I had to do, but not sure how to do it in Node (let alone Ava). I had never actually used a unit testing framework in Javascript before, so I spent a majority of the time researching how to effectively test. In the end, I was only able to cover one of the classes I had hoped to cover, the StringUtils class. Prior to submission, I was in the middle of refactoring the entire codebase to include Mongo and Redis wrapper classes to make test coverage that much simpler.



