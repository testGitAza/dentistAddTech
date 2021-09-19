const {masters,master_events} = require('../models');
const ApiError = require('../exceptions/api-error');

class MastersService {
    async getAllMasters() {
        return await masters.findAll();
    }

    async getByOrganizationId(organizationId) {
        return await masters.findAll({where:{organization_id: organizationId}});
    }

    async getListMasters(organizationId) {
        return await masters.findAll({where: {enabled:true, organization_id: organizationId}});
    }

    async getByPk(id,organizationId) {
        return await masters.findOne({where:{id:id, organization_id: organizationId, enabled: true}});
    }

    async create(master_name, master_description, master_start, master_end,color,enabled,organizationId,userId){
        return await masters.create({
            master_name:master_name,
            master_description:master_description,
            master_start:master_start,
            color:color,
            master_end:master_end,
            enabled: enabled,
            organization_id:organizationId,
            create_user_id: userId
        });
    }

    async update(id,master_name, master_description,master_start,master_end,color,enabled){

        const masterData = await masters.findOne({ where: { id: id }});
        if(!masterData){
            throw ApiError.BadRequest(`Не существует`)
        }
        masterData.master_name = master_name;
        masterData.master_description = master_description;
        masterData.master_start = master_start;
        masterData.master_end = master_end;
        masterData.color = color;
        masterData.enabled = enabled;
        await masterData.save();
        return masterData;
    }

    async delete(id){
        const masterData = await masters.findOne({
            where: { id: id },
            include:[{model: master_events}]
        });
        if(!masterData){
            throw ApiError.BadRequest(`Не существует`)
        }
        if(masterData.master_events && masterData.master_events.length>0){
            throw ApiError.BadRequest(`У данного мастера существуют события`)
        }
        await masterData.destroy();
        return  masterData
    }

    async updateLogo(id,master_logo){
        const masterData = await masters.findOne({ where: { id: id }});
        if(!masterData){
            throw ApiError.BadRequest(`Не существует`)
        }
        masterData.master_logo = master_logo;
        await masterData.save();
        return masterData
    }
}

module.exports = new MastersService();
