const mongoose = require("mongoose")
const { encrypt, decrypt } = require('../utils/cryptoUtils');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        set: encrypt,
        get: decrypt,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        set: encrypt,
        get: decrypt,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Admin"
    },
    schoolName: {
        type: String,
        unique: true,
        required: true
    }
},{ toJSON: { getters: true }, toObject: { getters: true } });

module.exports = mongoose.model("admin", adminSchema)
