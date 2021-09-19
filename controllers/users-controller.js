const {validationResult} = require('express-validator');
const userService = require('../service/users-service');
const rolesService = require('../service/roles-service');
const ApiError = require('../exceptions/api-error');

class UsersController {
    async getAllUsers(req, res, next) {
        try {

            if(await rolesService.checkCurrentRoles(req.user.roles, 'SUPER_ADMIN')) {
                const users = await userService.getAllUsers();
                return res.json(users);
            }else{

                const users = await userService.getUsersByOrganizationId(req.user.organizationId);
                return res.json(users);
            }
        } catch (e) {
            next(e);
        }
    }

    async getCurrentUser(req, res, next) {
        try {
            const users = await userService.getCurrentUser(req.user.id);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }



    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {login, password,surname,name,enabled,roles, organizationLink} = req.body;
            const user = await userService.registration(login, password, surname, name, enabled,roles, organizationLink.id);
            user.organizationLink = organizationLink; //todo
            return res.status(201).json({message: `Пользователь ${user.login} создан`, user: user});
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {id, login, surname, name, enabled,roles,organizationLink} = req.body;
            const user = await userService.updateUser(id, login, surname, name, enabled,roles, organizationLink.id);
            user.organizationLink = organizationLink; //todo
            return res.status(201).json({message: `Пользователь ${user.login} отредактирован`, user: user});
        } catch (e) {
            next(e);
        }
    }

    async updateUserPassword(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {id, login, password,roles,organizationLink} = req.body;
            const user = await userService.updateUserPassword(id, login, password);
            user.organizationLink = organizationLink; //todo
            user.roles = roles; //todo
            return res.status(201).json({message: `Пользователь ${user.login} отредактирован`, user: user});
        } catch (e) {
            next(e);
        }
    }

    async updateCurrentUserPassword(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {password} = req.body;
            const user = await userService.updateUserPassword(req.user.id, password);

            return res.status(201).json({message: `Пользователь ${user.login} отредактирован`, user: user});
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {login, password} = req.body;
            const userData = await userService.login(login, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }
}
module.exports = new UsersController();