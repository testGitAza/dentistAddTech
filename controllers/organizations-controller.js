const {validationResult} = require('express-validator');
const organizationsService = require('../service/organiztions-service');
const ApiError = require('../exceptions/api-error');
const rolesService = require('../service/roles-service');

const multer = require('multer');
const glob = require('glob');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image')
    },
    filename: (req, file, cb) => {
        cb(null, 'organizations-' +req.params.id +'-' + Date.now() +  '.jpg')
    }
});

const upload = multer({storage}).single('file');

class OrganizationsController {
    async getCurrent(req, res, next) {
        const organizations = await organizationsService.getCurrent(req.user.organizationId);
        return res.json(organizations);
    }
    async getAll(req, res, next) {
        if(await rolesService.checkCurrentRoles(req.user.roles, 'SUPER_ADMIN')){
            const organizations = await organizationsService.getAll();
            return res.json(organizations);
        }
        else{
            const organizations = await organizationsService.getCurrentArr(req.user.organizationId);
            return res.json(organizations);
        }
    }

    async create(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {organization_name, enabled} = req.body;
            const organization = await organizationsService.create(organization_name, enabled);
            return  res.status(201).json({message: `Запись создана`, organization});
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
            const {id,organization_name, enabled} = req.body;
            const organization = await organizationsService.update(id,organization_name, enabled);
            return  res.status(201).json({message: `Запись создана`, organization});
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
            await organizationsService.delete(id);
            return res.status(201).json({message: `Запись удалена`});
        } catch (e) {
            next(e);
        }
    }

    async updateLogo(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {id,organization_logo} = req.body;
            const organization = await organizationsService.updateLogo(id,organization_logo);
            return res.status(201).json({message: 'Успешно сохранено', organization});
        } catch (e) {
            next(e);
        }
    }

    async uploadLogo(req, res, next) {
        try {
            glob('image/organizations-' +req.params.id +'-*.jpg', null, function (er, files) {
                for (const file of files) {
                    fs.unlinkSync(file)
                }
            });
            upload(req,res,(err) => {
                if(err){
                    return res.status(500).json(err)
                }
                return res.status(200).send(req.file)
            })
        }
        catch (e) {
            return res.status(500).json({message:'Ошибка сервер, попробуйте снова', e:e.message})
        }
    }



}
module.exports = new OrganizationsController();