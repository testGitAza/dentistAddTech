const {conference_event} = require('../models');
const ApiError = require('../exceptions/api-error');
const moment = require('moment');

class ConferenceEventsService {

    async getAllByConferenceId(conference_id) {
        return await conference_event.findAll({ where: { conference_id: conference_id } });
    }

    async create(title, start, end, description, seating_type, format, seating_count, contact, conference_id, cleaning,userId) {
        const conferenceEventsData =  await conference_event.create({
            title:title,
            start:start,
            end:end,
            description:description,
            seating_type:seating_type,
            format:format,
            seating_count:seating_count,
            contact:contact,
            conference_id:conference_id,
            create_user_id: userId
        });

        if(cleaning){
            await conference_event.create({
                title:'cleaning',
                start: moment(conferenceEventsData.start).add(-30, 'm').toDate(),
                end:conferenceEventsData.start,
                'color': 'green',
                conference_id:conference_id,
                create_user_id: userId,
                parent_id: conferenceEventsData.id
            });
            await conference_event.create({
                title:'cleaning',
                start: conferenceEventsData.end,
                end: moment(conferenceEventsData.end).add(30, 'm').toDate(),
                'color': 'green',
                conference_id:conference_id,
                create_user_id: userId,
                parent_id: conferenceEventsData.id
            });
        }

        return conferenceEventsData;
    }

    async update(id,title, start, end, description, seating_type, format, seating_count, contact, conference_id) {
        const conferenceEventsData = await conference_event.findOne({ where: { id: id }});
        if(!conferenceEventsData){
            throw ApiError.BadRequest(`Не существует`)
        }
        conferenceEventsData.title = title;
        conferenceEventsData.start = start;
        conferenceEventsData.end = end;
        conferenceEventsData.description = description;
        conferenceEventsData.seating_type = seating_type;
        conferenceEventsData.format = format;
        conferenceEventsData.seating_count = seating_count;
        conferenceEventsData.contact = contact;
        conferenceEventsData.conference_id = conference_id;
        await conferenceEventsData.save();
        return conferenceEventsData;
    }

    async updateStartEnd(id, start, end) {
        const conferenceEventsData = await conference_event.findOne({ where: { id: id }});
        if(!conferenceEventsData){
            throw ApiError.BadRequest(`Не существует`)
        }
        conferenceEventsData.start = start;
        conferenceEventsData.end = end;
        await conferenceEventsData.save();
        return conferenceEventsData;
    }

    async delete(id) {
        const conferenceEventsData = await conference_event.findOne({ where: { id: id }});
        if(!conferenceEventsData){
            throw ApiError.BadRequest(`Не существует`)
        }
        await conferenceEventsData.destroy();
        return conferenceEventsData;
    }
}

module.exports = new ConferenceEventsService();
