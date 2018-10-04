const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatMessageSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    msg: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);