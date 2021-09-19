const {validationResult} = require('express-validator');
const masterEventsService = require('../service/master_events-service');
const ApiError = require('../exceptions/api-error');

class MasterEventsController {

    async getAllByMasterId(req, res, next) {
        try {
            const master_events = await masterEventsService.getAllByMasterId(req.params.master_id, req.user.organizationId);
            return res.json(master_events);
        } catch (e) {
            next(e);
        }
    }

    async getMastersEventsByIds(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {mastersId} = req.body;
            const master_events = await masterEventsService.getMastersEventsByIds(mastersId, req.user.organizationId);
            return res.json(master_events);
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
            const {
                event_start,
                event_end,
                event_description,
                event_contact,
                event_sum,
                color,
                organizationClientLink,
                master_id
            } = req.body;
            const master_event = await masterEventsService.create(
                event_start,
                event_end,
                event_description,
                event_contact,
                event_sum,
                color,
                organizationClientLink.id,
                master_id,
                req.user.organizationId,
                req.user.id
            );
            return res.status(201).json({message: `Событие создано`, master_event});
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
            const {
                id,
                event_start,
                event_end,
                event_description,
                event_contact,
                event_sum,
                color,
                master_id,
                organizationClientLink,
            } = req.body;
            const master_event = await masterEventsService.update(
                id,
                event_start,
                event_end,
                event_description,
                event_contact,
                event_sum,
                color,
                master_id,
                organizationClientLink
            );
            return  res.status(201).json({message: `Событие было изменено.`, master_event});
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
            const {id,  event_start, event_end, organizationClientLink} = req.body;
            const master_event = await masterEventsService.updateStartEnd(id, event_start, event_end);
            master_event.organizationClientLink = organizationClientLink;
            return  res.status(201).json({message: `Событие  было изменено`, master_event});
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
            const { id } = req.body;
            await masterEventsService.delete(id);
            return res.status(201).json({message: `Событие было удалено`});
        } catch (e) {
            next(e);
        }
    }
}
module.exports = new MasterEventsController();