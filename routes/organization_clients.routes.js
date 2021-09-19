const {Router} = require('express');
const roleMiddleware = require('../middleware/role.middleware');
const organizationClientsController = require('../controllers/organization_clients-controller');
const router = Router();
const {check} = require('express-validator');

router.get(
    '/getAll',
    roleMiddleware(['ADMIN']),
    organizationClientsController.getByOrganization
);
router.post(
    '/create',
    roleMiddleware(['ADMIN']),
    [
        check('client_name','Наименование должно быть больше трех символов').isLength({min:3})
    ],
    organizationClientsController.create
);
router.post(
    '/update',
    roleMiddleware(['ADMIN']),
    [
        check('client_name','Наименование должно быть больше трех символов').isLength({min:3}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    organizationClientsController.update
);
router.post(
    '/delete',
    roleMiddleware(['ADMIN']),
    [
       check('id','Отсутствует идентификатор').isInt()
    ],
    organizationClientsController.delete
);



module.exports = router;
