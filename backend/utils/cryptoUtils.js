const crypto = require('crypto');

const secretKey = process.env.AES_SECRET_KEY || 'mySuperSecretKey1234567890123456'; // 32 bytes
const iv = process.env.AES_IV || '1234567890123456'; // 16 bytes

// Cifrar
const encrypt = (text) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv));
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Descifrar
const decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), Buffer.from(iv));
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

module.exports = { encrypt, decrypt };
