// user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    user_ID: String,
    password: String,
    subscribedTopics: [String]
});

module.exports = mongoose.model('User', userSchema);
