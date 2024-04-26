// models/Topic.js
const { Schema, model } = require('mongoose');

const topicSchema = new Schema({
    name: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Topic = model('Topic', topicSchema);

module.exports = Topic;