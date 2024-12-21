const mongoose = require("mongoose")
const { encrypt, decrypt } = require('../utils/cryptoUtils');

const teacherSchema = new mongoose.Schema({
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
        default: "Teacher"
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    teachSubject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subject',
    },
    teachSclass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        presentCount: {
            type: String,
        },
        absentCount: {
            type: String,
        }
    }]
}, { toJSON: { getters: true }, toObject: { getters: true } });

module.exports = mongoose.model("teacher", teacherSchema)
