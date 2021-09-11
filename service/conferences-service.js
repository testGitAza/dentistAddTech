const {conference,conference_event} = require('../models');
const ApiError = require('../exceptions/api-error');

class ConferencesService {
    async getAllConferences() {
        return await conference.findAll();
    }

    async getListConferences() {
        return await conference.findAll({where: {enabled:true}});
    }

    async getByPk(id) {
        return await conference.findByPk(id);
    }

    async create(name, max_count,userId,enabled){
        return await conference.create({
            name:name, max_count:max_count, create_user_id: userId, enabled:enabled
        });
    }

    async update(id,name,max_count, enabled){

        const conferenceData = await conference.findOne({ where: { id: id }});
        if(!conferenceData){
            throw ApiError.BadRequest(`Не существует`)
        }
        conferenceData.name = name;
        conferenceData.max_count = max_count;
        conferenceData.enabled = enabled;
        await conferenceData.save();
        return conferenceData;
    }

    async delete(id){
        const conferenceData = await conference.findOne({
            where: { id: id },
            include:[{model: conference_event}]
        });
        if(!conferenceData){
            throw ApiError.BadRequest(`Не существует`)
        }
        if(conferenceData.conference_events && conferenceData.conference_events.length>0){
            throw ApiError.BadRequest(`У данного конференц зала существуют события`)
        }
        await conferenceData.destroy();
        return  conferenceData
    }

    async updateImage(id,image){
        const conferenceData = await conference.findOne({ where: { id: id }});
        if(!conferenceData){
            throw ApiError.BadRequest(`Не существует`)
        }
        conferenceData.image = image;
        await conferenceData.save();
        return conferenceData
    }
}

module.exports = new ConferencesService();
