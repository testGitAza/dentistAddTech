const {role, user_role} = require('../models');

class RolesService {
    async getAllRoles() {
        return  await role.findAll();
    }

    async createUserRoles(userId, roleId) {
        return  await user_role.create({
            user_id: userId, role_id:roleId
        });
    }

    async deleteUserRoles(userId, roleId) {
        return await user_role.destroy({where:{user_id:userId}});
    }


}

module.exports = new RolesService();
