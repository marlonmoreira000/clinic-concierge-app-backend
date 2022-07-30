const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");

// Verify if the refresh token request is valid
const verifyRefreshToken = (refreshToken) => {
    const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

    // Find existing user token from given refresh token
    return new Promise((resolve, reject) => {
        Token.findOne({ token: refreshToken }, (err, doc) => {
            if (!doc) {
                return reject({ error: true, message: "Invalid refresh token" });
            }

            // Verify token with JWT
            jwt.verify(refreshToken, privateKey, (err, tokenDetails) => {
                if (err) {
                    return reject({
                        error: true,
                        message: "Invalid refresh token",
                    });
                }
        
                resolve({ tokenDetails, error: false, message: "Valid refresh token" });
            });
        });
    })
}

module.exports = verifyRefreshToken