const {organization_clients,master_events} = require('../models');
const ApiError = require('../exceptions/api-error');

class OrganiztionClientsService {
    async getByOrganization(organizationId) {
        return  await organization_clients.findAll({where:{organization_id: organizationId}});
    }

    async create(client_name, client_phone, client_contacts, client_description, enabled, organizationId, userId){

        return await organization_clients.create({
            client_name:client_name,
            client_phone:client_phone,
            client_contacts: client_contacts,
            client_description: client_description,
            enabled: enabled,
            organization_id:organizationId,
            create_user_id: userId
        });
    }
    async update(id,client_name, client_phone, client_contacts, client_description, enabled, organizationId){

        const organizationClientData = await organization_clients.findOne({ where: { id: id, organization_id: organizationId}});
        if(!organizationClientData){
            throw ApiError.BadRequest(`Не существует`)
        }
        organizationClientData.client_name = client_name;
        organizationClientData.client_phone = client_phone;
        organizationClientData.client_contacts = client_contacts;
        organizationClientData.client_description = client_description;
        organizationClientData.enabled = enabled;
        await organizationClientData.save();
        return organizationClientData;
    }
    async delete(id){

        const organizationClientData = await organization_clients.findOne({
            where: { id: id },
            include:[{model: master_events}]
        });
        if(!organizationClientData){
            throw ApiError.BadRequest(`Не существует`)
        }
        if(organizationClientData.master_events && organizationClientData.master_events.length > 0){
            throw ApiError.BadRequest(`У данного клиента существуют события`)
        }

        await organizationClientData.destroy();
        return  organizationClientData
    }
}

module.exports = new OrganiztionClientsService();
