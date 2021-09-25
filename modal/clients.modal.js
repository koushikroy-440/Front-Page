const mongo = require('mongoose');
const { Schema } = mongo;

const clientSchema = new Schema({
    companyId: String,
    clientName: String,
    clientEmail: {
        type: String,
        unique: true,
    },
    clientCountry: String,
    clientMobile: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongo.model("client",clientSchema);