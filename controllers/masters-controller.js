const {validationResult} = require('express-validator');
const masterService = require('../service/masters-service');
const ApiError = require('../exceptions/api-error');
const multer = require('multer');
const glob = require('glob');
const fs = require('fs');
const moment = require('moment');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image')
    },
    filename: (req, file, cb) => {
        cb(null, 'masters-' +req.params.id +'-' + Date.now() +  '.jpg')
    }
});

const upload = multer({storage}).single('file');

class MastersController {
    async getAllMasters(req, res, next) {
        try {
            const masters = await masterService.getByOrganizationId(req.user.organizationId);
            return res.json(masters);
        } catch (e) {
            next(e);
        }
    }

    async getListMasters(req, res, next) {
        try {
            const master = await masterService.getListMasters(req.user.organizationId);
            return res.json(master);
        } catch (e) {
            next(e);
        }
    }

    async getByPk(req, res, next) {
        try {
            const masters = await masterService.getByPk(req.params.id,req.user.organizationId);
            return res.json(masters);
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
            const {master_name, master_description, master_start, master_end, color, enabled} = req.body;

            let isValidStart = moment(master_start, 'HH:mm', true).isValid();
            let isValidEnd = moment(master_end, 'HH:mm', true).isValid();
            if(!isValidStart || !isValidEnd){
                return next(ApiError.BadRequest('Ошибка при валидации даты'))
            }

            const master = await masterService.create(master_name,master_description, master_start, master_end,color, enabled,req.user.organizationId,req.user.id);
            return  res.status(201).json({message: `Успешно создана`, master});
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
            const {id,master_name, master_description,master_start,master_end,color,enabled} = req.body;
            let isValidStart = moment(master_start, 'HH:mm', true).isValid();
            let isValidEnd = moment(master_end, 'HH:mm', true).isValid();
            if(!isValidStart || !isValidEnd){
                return next(ApiError.BadRequest('Ошибка при валидации даты'))
            }
            const master = await masterService.update(id,master_name, master_description,master_start,master_end,color,enabled);
            return res.status(201).json({message: `Успешно изменена`, master});
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
            await masterService.delete(id);
            return res.status(201).json({message: `Успешно удалена`});
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
            const {id,master_logo} = req.body;
            const master = await masterService.updateLogo(id,master_logo);
            return res.status(201).json({message: 'Успешно сохранено', master});
        } catch (e) {
            next(e);
        }
    }

    async uploadLogo(req, res, next) {
        try {
            glob('image/masters-' +req.params.id +'-*.jpg', null, function (er, files) {
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
module.exports = new MastersController();