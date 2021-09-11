const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

module.exports = function (roles) {
    return function (req, res, next) {

        if (req.method === 'OPTIONS') {
            next()
        }

        try {
            const authorizationHeader = req.headers.authorization;
            if (!authorizationHeader) {
                return next(ApiError.UnauthorizedError());
            }
            const accessToken = authorizationHeader.split(' ')[1];
            if (!accessToken) {
                return next(ApiError.UnauthorizedError());
            }
            const userData = tokenService.validateAccessToken(accessToken);
            const {roles: userRoles} = userData;
            let hasRole = false;
            userRoles.forEach(role => {
                if (roles.includes(role)) {
                    hasRole = true;
                }
            });
            if (!hasRole) {
                return next(ApiError.ForbiddenError());
            }
            req.user = userData;
            next();
        } catch (e) {
            return next(ApiError.ForbiddenError());
        }
    }
};
