const { signToken } = require('./auth.service');

function createAuthResponse(user, roleSpecificData = {}) {
    const payload = {
        email: user.email || user.rollNum,
        role: user.role,
    };

    const token = signToken(payload);

    const profile = {
        id: user._id,
        fullName: `${user.first_name || user.name} ${user.last_name || ''}`.trim(),
        email: user.email || null,
        role: user.role,
        ...roleSpecificData,
    };

    return { token, profile };
}

module.exports = { createAuthResponse };
