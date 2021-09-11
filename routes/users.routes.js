const {Router} = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const usersController = require('../controllers/users-controller');
const router = Router();
const {check} = require('express-validator');

router.get(
    '/',
    roleMiddleware(['ADMIN']),
    usersController.getAllUsers
);

router.post(
    '/create',
    roleMiddleware(['ADMIN']),
    [
        check('login','Логина должен быть больше трех символов').isLength({min:3}), //todo all
        check('surname','Фамилия должна быть больше одного символов').isLength({min:1}),
        check('name','Имя должно быть больше одного символов').isLength({min:1}),
        check('password','Пароль должен быть больше трех символов').isLength({min:3}),
        check('roles','Пароль должен быть больше трех символов').isArray({min:1})
    ],
    usersController.registration
    );

router.post(
    '/update/user',
    roleMiddleware(['ADMIN']),
    [
        check('login','Логина должен быть больше трех символов').isLength({min:3}), //todo all
        check('surname','Фамилия должна быть больше одного символов').isLength({min:1}),
        check('name','Имя должно быть больше одного символов').isLength({min:1}),
        check('id','Отсутствует идентификатор').isInt(),
        check('roles','Пароль должен быть больше трех символов').isArray({min:1})
    ],
    usersController.updateUser
);

router.post(
    '/update/password',
    roleMiddleware(['ADMIN']),
    [
        check('login','Логина должен быть больше трех символов').isLength({min:3}), //todo all
        check('password','Пароль должен быть больше трех символов').isLength({min:3}),
        check('id','Отсутствует идентификатор').isInt()
    ],
    usersController.updateUserPassword
);

router.post(
    '/login',
    [
        check('login','Логина должен быть больше трех символов').isLength({min:3}), //todo all
        check('password','Пароль должен быть больше трех символов').isLength({min:3})
    ],
    usersController.login
);

router.get('/refresh', usersController.refresh);
router.post('/logout', usersController.logout);

module.exports = router;
