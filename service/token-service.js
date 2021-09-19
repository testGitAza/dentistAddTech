const jwt = require('jsonwebtoken');
const config = require('config');
const {tokens} = require('../models');

class TokenService {
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, config.get('jwtSecret'), {expiresIn: '1h'}) ;//15s
         const refreshToken = jwt.sign(payload, config.get('jwtSecret'), {expiresIn: '7d'});
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(tokenData) {
        try {
            return jwt.verify(tokenData, config.get('jwtSecret'));
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(tokenData) {
        try {
            return jwt.verify(tokenData, config.get('jwtSecret'));
        } catch (e) {
            return null;
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokens.findOne({where: {user_id: userId}});
        if (tokenData) {
            tokenData.refresh_token = refreshToken;
            return await tokenData.save();
        }
        return  await tokens.create({user_id: userId, refresh_token: refreshToken});
    }

    async removeToken(refreshToken) {

        return await tokens.destroy({where:{refresh_token:refreshToken}});
    }

    async findToken(refreshToken) {
        return await tokens.findOne({where:{refresh_token:refreshToken}});
    }
}

module.exports = new TokenService();
