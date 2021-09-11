const {validationResult} = require('express-validator');
const conferenceEventsService = require('../service/conference_events-service');
const ApiError = require('../exceptions/api-error');

class ConferenceEventsController {

    async getAllByConferenceId(req, res, next) {
        try {
            const conference_events = await conferenceEventsService.getAllByConferenceId(req.params.conference_id);
            return res.json(conference_events);
        } catch (e) {
            next(e);
        }
    }

    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {title, start, end, description, seating_type, format, seating_count, contact, conference_id, cleaning} = req.body;
            const conference_event = await conferenceEventsService.create(title, start, end, description, seating_type, format, seating_count, contact, conference_id, cleaning, req.user.userId);
            return res.status(201).json({message: `Событие "${conference_event.title}" создано`, conference_event});
        } catch (e) {
            next(e);
        }
    }

    async update(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {id, title, start, end, description, seating_type, format, seating_count, contact, conference_id} = req.body;
            const conference_event = await conferenceEventsService.update(id,title, start, end, description, seating_type, format, seating_count, contact, conference_id);
            return  res.status(201).json({message: `Событие "${conference_event.title}" было изменено`, conference_event});
        } catch (e) {
            next(e);
        }
    }

    async updateStartEnd(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {id,  start, end} = req.body;
            const conference_event = await conferenceEventsService.updateStartEnd(id, start, end);
            return  res.status(201).json({message: `Событие "${conference_event.title}" было изменено`, conference_event});
        } catch (e) {
            next(e);
        }
    }

    async delete(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const { id,title} = req.body;
            await conferenceEventsService.delete( id);
            return res.status(201).json({message: `Событие "${title}" было удалено`});
        } catch (e) {
            next(e);
        }
    }
}
module.exports = new ConferenceEventsController();