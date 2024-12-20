const jwt = require('jsonwebtoken');
const SECRET = 'mysecretkey';

function signToken(payload) {
  const token = jwt.sign(payload, SECRET, {
    expiresIn: '1d',
    algorithm: 'HS256',
  });
  return token;
}

function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
}

function decodeToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

module.exports = { signToken, verifyToken, decodeToken };
