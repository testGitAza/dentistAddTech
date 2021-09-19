const {organizations,users} = require('../models');
const ApiError = require('../exceptions/api-error');

class OrganizationService {
    async getAll() {
        return  await organizations.findAll();
    }

    async getCurrent(id) {
        return  await organizations.findOne({where: {id:id}});
    }

    async getCurrentArr(id) {
        return  await organizations.findAll({where: {id:id}});
    }

    async create(organization_name, enabled){
        return await organizations.create({
            organization_name:organization_name,
            enabled:enabled
        });
    }

    async update(id,organization_name, enabled){
        const organizationData = await organizations.findOne({ where: { id: id }});
        if(!organizationData){
            throw ApiError.BadRequest(`Не существует`)
        }
        organizationData.organization_name = organization_name;
        organizationData.enabled = enabled;
        await organizationData.save();
        return organizationData;
    }

    async delete(id){
        const organizationData = await organizations.findOne({
            where: { id: id },
            include:[{model: users}]
        });
        if(!organizationData){
            throw ApiError.BadRequest(`Не существует`)
        }
        if(organizationData.users && organizationData.users.length > 0){
             throw ApiError.BadRequest(`У данного объеста существуют зависимости`)
        }
        await organizationData.destroy();
        return  organizationData
    }

    async updateLogo(id,organization_logo){
        const organizationData = await organizations.findOne({ where: { id: id }});
        if(!organizationData){
            throw ApiError.BadRequest(`Не существует`)
        }
        organizationData.organization_logo = organization_logo;
        await organizationData.save();
        return organizationData
    }
}

module.exports = new OrganizationService();
