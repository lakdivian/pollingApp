const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new Schema({
    os: {
        type: String,
        required: true
    },
    votes: {
        type: Number,
        required: true
    }
});

const Poll = mongoose.model('Poll', PollSchema);

module.exports = Poll;