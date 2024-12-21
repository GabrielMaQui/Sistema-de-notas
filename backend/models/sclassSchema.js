const mongoose = require("mongoose");
const { encrypt, decrypt } = require('../utils/cryptoUtils');
const sclassSchema = new mongoose.Schema({
    sclassName: {
        type: String,
        required: true,
        set: encrypt,
        get: decrypt,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin'
    },
}, { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } });

module.exports = mongoose.model("sclass", sclassSchema);

