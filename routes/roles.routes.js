const {Router} = require('express');
const roleMiddleware = require('../middleware/role.middleware');
const rolesController = require('../controllers/roles-controller');
const router = Router();

router.get(
    '/',
    roleMiddleware(['SUPER_ADMIN','ADMIN']),
    rolesController.getAllRoles
);



module.exports = router;
