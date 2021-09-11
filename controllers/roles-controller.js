const {validationResult} = require('express-validator');
const roleService = require('../service/roles-service');
const ApiError = require('../exceptions/api-error');

class RolesController {
    async getAllRoles(req, res, next) {
        try {
            const users = await roleService.getAllRoles();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

}
module.exports = new RolesController();