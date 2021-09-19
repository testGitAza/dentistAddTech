const {validationResult} = require('express-validator');
const organizationClientsService = require('../service/organiztion_clients-service');
const ApiError = require('../exceptions/api-error');
const rolesService = require('../service/roles-service');

class OrganizationsController {
    async getByOrganization(req, res, next) {
        const organization_clients = await organizationClientsService.getByOrganization(req.user.organizationId);
        return res.json(organization_clients);
    }

    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {client_name, client_phone, client_contacts, client_description, enabled} = req.body;

            const organization_client = await organizationClientsService.create(client_name, client_phone, client_contacts, client_description, enabled, req.user.organizationId, req.user.id);
            return  res.status(201).json({message: `Запись создана`, organization_client});
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
            const {id,client_name, client_phone, client_contacts, client_description, enabled} = req.body;
            const organization_client = await organizationClientsService.update(id,client_name, client_phone, client_contacts, client_description, enabled, req.user.organizationId);
            return  res.status(201).json({message: `Запись создана`, organization_client});
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
            const {id} = req.body;
            await organizationClientsService.delete(id);
            return res.status(201).json({message: `Запись удалена`});
        } catch (e) {
            next(e);
        }
    }



}
module.exports = new OrganizationsController();