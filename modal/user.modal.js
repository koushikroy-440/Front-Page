const mongo = require('mongoose');
const bcryptService = require('../services/bcrypt.service');
const { Schema } = mongo;

const userSchema = new Schema({
    uid:{
        type: String,
        unique: true
    },
    password:{
        type: String,
        require: [true,"password field is required"]
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

userSchema.pre('save', async function (next) {
    const data = this.password.toString();
    const encryptedPassword = await bcryptService.encrypt(data);
    this.password = encryptedPassword;
    next();
});

module.exports = mongo.model("User",userSchema);