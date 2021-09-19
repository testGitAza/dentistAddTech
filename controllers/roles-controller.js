
const rolesService = require('../service/roles-service');
const roleMiddleware = require('../middleware/role.middleware');


class RolesController {
    async getAllRoles(req, res, next) {
        try {
            if(await rolesService.checkCurrentRoles(req.user.roles, 'SUPER_ADMIN')){
                const users = await rolesService.getAllRoles();
                return res.json(users);
            }
            else{
                const users = await rolesService.getRolesWithout('SUPER_ADMIN');
                return res.json(users);
            }
        } catch (e) {
            next(e);
        }
    }

}
module.exports = new RolesController();