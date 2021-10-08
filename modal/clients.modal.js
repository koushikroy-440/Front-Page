const mongo = require('mongoose');
const { Schema } = mongo;

const clientSchema = new Schema({
    companyId: String,
    clientName: String,
    clientEmail: String,
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

//unique data validation 
clientSchema.pre('save', async function (next) {
    const query = {
        companyId: this.companyId,
        clientEmail: this.clientEmail
    }
    let length = await mongo.model('client').countDocuments(query);
    if (length == 0) {
        next();
    } else {
        next('duplicate client email');
    }
});

module.exports = mongo.model("client", clientSchema);