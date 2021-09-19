const {roles, user_roles} = require('../models');
const { Op } = require("sequelize");

class RolesService {
    async getAllRoles() {
        return  await roles.findAll();
    }

    async getRolesWithout(role_name) {
        return  await roles.findAll({where:{role_name: {
                    [Op.ne]: role_name
                }}});
    }

    async createUserRoles(userId, roleId) {
        return  await user_roles.create({
            user_id: userId, role_id:roleId
        });
    }

    async deleteUserRoles(userId) {
        return await user_roles.destroy({where:{user_id:userId}});
    }

    async checkCurrentRoles(currentRoles, findRole){
        let isSa = false;
        currentRoles.forEach(currentRole =>{
            if(currentRole === findRole){
                isSa = true;
            }
        });
        return isSa;
    }


}

module.exports = new RolesService();
