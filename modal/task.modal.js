const mongo = require('mongoose');
const { Schema } = mongo;

const taskSchema = new Schema({
    taskDescription: {
        type: String
    },
    assignTo: {
        type: String
    },
    name: {
        type: String
    },
    status: {
        type: String,
        default: "pending"
    }
}, {
    timestamps: true
});

module.exports = mongo.model('Task', taskSchema);