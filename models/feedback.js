const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    sender_id: {type: Number},
    receiver_id: {type: Number},
    feedback_data: {type: String}
})

const model = mongoose.model('feedback', feedbackSchema)

module.exports = model;