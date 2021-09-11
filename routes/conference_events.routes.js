const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const router = Router();
const {check} = require('express-validator');
const conferenceEventsController = require('../controllers/conference_events-controller');

router.get('/:conference_id', authMiddleware, conferenceEventsController.getAllByConferenceId);

router.post(
    '/create',
    authMiddleware,
    [
        check('title','Название должно быть больше трех символов').isLength({min:3}), //todo check all
        check('conference_id','Отсутствует идентификатор конференц зала').isInt()
    ],
    conferenceEventsController.create
);

router.post(
    '/update',
    authMiddleware,
    [
        check('title','Название должно быть больше трех символов').isLength({min:3}), //todo check all
        check('conference_id','Отсутствует идентификатор конференц зала').isInt()
    ],
    conferenceEventsController.update
);

router.post(
    '/delete',
    authMiddleware,
    [
        check('title','Название должно быть больше трех символов').isLength({min:3}),
        check('conference_id','Отсутствует идентификатор конференц зала').isInt()
    ],
    conferenceEventsController.delete
);

router.post(
    '/update/start_end_date',
    authMiddleware,
    [
        check('id','Отсутствует идентификатор').isInt() //todo
    ],
    conferenceEventsController.updateStartEnd
);

module.exports = router;
