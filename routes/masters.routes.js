const {Router} = require('express');
const router = Router();
const roleMiddleware = require('../middleware/role.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const {check} = require('express-validator');
const mastersController = require('../controllers/masters-controller');

router.get('/', roleMiddleware(['ADMIN']), mastersController.getAllMasters);
router.get('/list', authMiddleware, mastersController.getListMasters);
router.get('/:id', authMiddleware, mastersController.getByPk);

router.post(
    '/create',
    roleMiddleware(['ADMIN']),
    [
        check('master_name','Наименование должно быть больше трех символов').isLength({min:3}),
        check('master_start','Формат даты').isLength({min:5, max:5}),
        check('master_end','Формат даты').isLength({min:5, max:5})
    ],
    mastersController.create
    );

router.post(
    '/update',
    roleMiddleware(['ADMIN']),
    [
        check('master_name','Наименование должно быть больше трех символов').isLength({min:3}),
        check('master_start','Формат даты').isLength({min:5, max:5}),
        check('master_end','Формат даты').isLength({min:5, max:5}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    mastersController.update
);

router.post(
    '/delete',
    roleMiddleware(['ADMIN']),
    [
        check('master_name','Наименование должно быть больше трех символов').isLength({min:3}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    mastersController.delete
);

router.post(
    '/update/logo',
    roleMiddleware(['ADMIN']),
    [
        check('master_logo','Отсутствует идентификатор изображения').isLength({min:15}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    mastersController.updateLogo
);

router.post(
    '/upload/logo/:id',
    roleMiddleware(['ADMIN']),
    [
        check('master_logo','Отсутствует идентификатор изображения').isLength({min:15}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    mastersController.uploadLogo
);


module.exports = router;
