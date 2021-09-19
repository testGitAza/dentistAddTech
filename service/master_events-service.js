const {master_events, organization_clients,masters,users} = require('../models');
const ApiError = require('../exceptions/api-error');

class MasterEventsService {

    async getAllByMasterId(master_id,organizationId) {
        return await master_events.findAll({
            where: { master_id: master_id, organization_id: organizationId } ,
            include:[
                {model: organization_clients, as: 'organizationClientLink'},
                {model: users, as: 'ownerLink'}
            ]
        });
    }
    async getMastersEventsByIds(mastersIds,organizationId) {
        return await master_events.findAll({
            where: { master_id: mastersIds, organization_id: organizationId } ,
            include:[
                {model: organization_clients, as: 'organizationClientLink'},
                {model: masters, as: 'masterLink'},
                {model: users, as: 'ownerLink'}
            ]
        });
    }

    async create(
        event_start,
        event_end,
        event_description,
        event_contact,
        event_sum,
        color,
        organization_client_id,
        master_id,
        organizationId,
        userId
    ) {
        const masterEvents =await master_events.create({
            event_start:event_start,
            event_end:event_end,
            event_description:event_description,
            event_contact:event_contact,
            event_sum:event_sum,
            color:color,
            organization_client_id:organization_client_id,
            master_id:master_id,
            organization_id:organizationId,
            create_user_id: userId
        });

        return await master_events.findOne(
            {
                where: {id: masterEvents.id},
                include:[
                    {model: organization_clients, as: 'organizationClientLink'},
                    {model: masters, as: 'masterLink'},
                    {model: users, as: 'ownerLink'}

                ]
            });
    }

    async update(
        id,
        event_start,
        event_end,
        event_description,
        event_contact,
        event_sum,
        color,
        master_id,
        organizationClientLink
    ) {
        const masterEvents = await master_events.findOne(
            {
                where: {id: id}
            });
        if(!masterEvents){
            throw ApiError.BadRequest(`Не существует`)
        }
        masterEvents.event_start = event_start;
        masterEvents.event_end = event_end;
        masterEvents.event_description = event_description;
        masterEvents.event_contact = event_contact;
        masterEvents.event_sum = event_sum;
        masterEvents.color = color;
        masterEvents.master_id = master_id;
        masterEvents.organization_client_id = organizationClientLink.id;
        await masterEvents.save();
        return await master_events.findOne(
            {
                where: {id: masterEvents.id},
                include:[
                    {model: organization_clients, as: 'organizationClientLink'},
                    {model: masters, as: 'masterLink'},
                    {model: users, as: 'ownerLink'}
                ]
            });
    }

    async updateStartEnd(id, event_start, event_end) {
        const masterEvents = await master_events.findOne(
            {
                where: {id: id}
            });
        if(!masterEvents){
            throw ApiError.BadRequest(`Не существует`)
        }
        masterEvents.event_start = event_start;
        masterEvents.event_end = event_end;
        await masterEvents.save();
        return await master_events.findOne(
            {
                where: {id: masterEvents.id},
                include:[
                    {model: organization_clients, as: 'organizationClientLink'},
                    {model: masters, as: 'masterLink'},
                    {model: users, as: 'ownerLink'}

                ]
            });
    }

    async delete(id) {
        const masterEvents = await master_events.findOne({ where: { id: id }});
        if(!masterEvents){
            throw ApiError.BadRequest(`Не существует`)
        }
        await masterEvents.destroy();
        return masterEvents;
    }
}

module.exports = new MasterEventsService();
