var express = require('express');
var router = express.Router();
const Pusher = require('pusher');
const PollSchema = require('../models/poll');

var pusher = new Pusher({
    appId: '785529',
    key: '93bdf2610ab0b2de1f86',
    secret: 'c8e0c608e25b058ead74',
    cluster: 'ap2',
    encrypted: true
});


/* GET home page. */
router.get('/', (req, res, next) => {
    PollSchema.find()
        .then(polls => {
            return res.json({ polls: polls })
        })
        .catch(err => console.log("error occured while querying the db"));
});

router.post('/', (req, res, next) => {

    const newPoll = new PollSchema;

    // Getting All the votes
    PollSchema.find({ os: req.body.os })
        .then((polls) => {
            if (polls.length === 0) {
                newPoll.os = req.body.os;
                newPoll.votes = 1;
                newPoll.save();
            } else {
                PollSchema.updateOne({ os: req.body.os }, {
                        $inc: { votes: 1 }
                    })
                    .then((res) => console.log("record updated", res))
                    .catch(err => console.log("failed to update the record"));
            }
        })
        .catch(err => console.log(err));

    pusher.trigger('os-poll', 'os-vote', {
        points: 1,
        os: req.body.os
    });
    console.log("I am Reaching here");
    return res.json({ success: true, message: "Thank You for voting" });
})

module.exports = router;