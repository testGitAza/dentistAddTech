const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const router = Router();
const {check} = require('express-validator');
const masterEventsController = require('../controllers/master_events-controller');

router.get('/:master_id', authMiddleware, masterEventsController.getAllByMasterId);

router.post('/getByMastersIds', authMiddleware, masterEventsController.getMastersEventsByIds); //todo arr ids

router.post(
    '/create',
    authMiddleware,
    [
        check('master_id','Отсутствует идентификатор').isInt(),
        check('organizationClientLink.id','Отсутствует идентификатор клиента').isInt(),
    ],
    masterEventsController.create
);

router.post(
    '/update',
    authMiddleware,
    [
        check('master_id','Отсутствует идентификатор').isInt(),//todo check all
        check('organizationClientLink.id','Отсутствует идентификатор клиента').isInt(),
    ],
    masterEventsController.update
);

router.post(
    '/delete',
    authMiddleware,
    [
        check('master_id','Отсутствует идентификатор').isInt()
    ],
    masterEventsController.delete
);

router.post(
    '/update/start_end_date',
    authMiddleware,
    [
        check('id','Отсутствует идентификатор').isInt() //todo
    ],
    masterEventsController.updateStartEnd
);

module.exports = router;
