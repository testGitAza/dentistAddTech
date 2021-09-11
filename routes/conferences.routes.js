const {Router} = require('express');
const router = Router();
const roleMiddleware = require('../middleware/role.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const {check} = require('express-validator');
const conferencesController = require('../controllers/conferences-controller');

router.get('/', roleMiddleware(['ADMIN']), conferencesController.getAllConferences);
router.get('/list', authMiddleware, conferencesController.getListConferences);
router.get('/:id', authMiddleware, conferencesController.getByPk);

router.post(
    '/create',
    roleMiddleware(['ADMIN']),
    [
        check('name','Название должно быть больше трех символов').isLength({min:3}),
        check('max_count','Максимальное количество должно быть числом').isInt()
    ],
    conferencesController.create
    );

router.post(
    '/update',
    roleMiddleware(['ADMIN']),
    [
        check('name','Название должно быть больше трех символов').isLength({min:3}),
        check('max_count','Максимальное количество должно быть числом').isInt(),
        check('id','Отсутствует идентификатор').isInt()
    ],
    conferencesController.update
);

router.post(
    '/delete',
    roleMiddleware(['ADMIN']),
    [
        check('name','Название конференц зала').isLength({min:3}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    conferencesController.delete
);

router.post(
    '/update/image',
    roleMiddleware(['ADMIN']),
    [
        check('image','Отсутствует идентификатор изображения').isLength({min:15}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    conferencesController.updateImage
);

router.post(
    '/upload/image/:id',
    roleMiddleware(['ADMIN']),
    [
        check('image','Отсутствует идентификатор изображения').isLength({min:15}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    conferencesController.uploadImage
);


module.exports = router;
