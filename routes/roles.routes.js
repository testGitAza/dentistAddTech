const {Router} = require('express');
const roleMiddleware = require('../middleware/role.middleware');
const rolesController = require('../controllers/roles-controller');
const router = Router();

router.get(
    '/',
    roleMiddleware(['ADMIN']),
    rolesController.getAllRoles
);



module.exports = router;
