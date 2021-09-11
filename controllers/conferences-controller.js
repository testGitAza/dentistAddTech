const {validationResult} = require('express-validator');
const conferencesService = require('../service/conferences-service');
const ApiError = require('../exceptions/api-error');
const multer = require('multer');
const glob = require('glob')
const fs = require('fs')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'image')
    },
    filename: (req, file, cb) => {
        cb(null, 'conference-' +req.params.id +'-' + Date.now() +  '.jpg')
    }
});

const upload = multer({storage}).single('file');

class ConferencesController {
    async getAllConferences(req, res, next) {
        try {
            const conferences = await conferencesService.getAllConferences();
            return res.json(conferences);
        } catch (e) {
            next(e);
        }
    }

    async getListConferences(req, res, next) {
        try {
            const conferences = await conferencesService.getListConferences();
            return res.json(conferences);
        } catch (e) {
            next(e);
        }
    }

    async getByPk(req, res, next) {
        try {
            const conference = await conferencesService.getByPk(req.params.id);
            return res.json(conference);
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

            const {name,max_count,enabled} = req.body;

            console.log( req)
            const conference = await conferencesService.create(name,max_count, req.user.userId,enabled);
            return  res.status(201).json({message: `Конференция ${conference.name} создана`, conference});
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
            const {id,name,max_count, enabled} = req.body;
            const conference = await conferencesService.update(id,name,max_count, enabled);
            return res.status(201).json({message: `Конференция ${conference.name} была изменена`, conference});
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
            const {id, name} = req.body;
            await conferencesService.delete(id);
            return res.status(201).json({message: `Конференц зал "${name}" удален`});
        } catch (e) {
            next(e);
        }
    }

    async updateImage(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {id,image} = req.body;
            const conference = await conferencesService.updateImage(id,image);
            return res.status(201).json({message: 'Успешно сохранено', conference});
        } catch (e) {
            next(e);
        }
    }

    async uploadImage(req, res, next) {
        try {
            glob('image/conference-' +req.params.id +'-*.jpg', null, function (er, files) {
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
module.exports = new ConferencesController();