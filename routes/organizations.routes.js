const {Router} = require('express');
const roleMiddleware = require('../middleware/role.middleware');
const organizationsController = require('../controllers/organizations-controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = Router();
const {check} = require('express-validator');

router.get(
    '/getAll',
    roleMiddleware(['SUPER_ADMIN','ADMIN']),
    organizationsController.getAll
);
router.post(
    '/create',
    roleMiddleware(['SUPER_ADMIN']),
    [
        check('organization_name','Наименование должно быть больше трех символов').isLength({min:3})
    ],
    organizationsController.create
);
router.post(
    '/update',
    roleMiddleware(['SUPER_ADMIN']),
    [
        check('organization_name','Наименование должно быть больше трех символов').isLength({min:3}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    organizationsController.update
);
router.post(
    '/delete',
    roleMiddleware(['SUPER_ADMIN']),
    [
       check('id','Отсутствует идентификатор').isInt()
    ],
    organizationsController.delete
);

router.post(
    '/update/logo',
    roleMiddleware(['SUPER_ADMIN']),
    [
        check('organization_logo','Отсутствует идентификатор изображения').isLength({min:15}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    organizationsController.updateLogo
);

router.post(
    '/upload/logo/:id',
    roleMiddleware(['SUPER_ADMIN']),
    [
        check('organization_logo','Отсутствует идентификатор изображения').isLength({min:15}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    organizationsController.uploadLogo
);

router.get(
    '/getCurrent',
    authMiddleware,
    organizationsController.getCurrent
);


module.exports = router;
