const {validationResult} = require('express-validator');
const userService = require('../service/users-service');
const ApiError = require('../exceptions/api-error');

class UsersController {
    async getAllUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
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
            const {login, password,surname,name,enabled,roles} = req.body;
            const user = await userService.registration(login, password, surname, name, enabled,roles);
            return res.status(201).json({message: `Пользователь ${user.userDto.login} создан`, user: user.userDto});
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
            const {id, login, surname, name, enabled,roles} = req.body;
            const user = await userService.updateUser(id, login, surname, name, enabled,roles);
            return res.status(201).json({message: `Пользователь ${user.userDto.login} отредактирован`, user: user.userDto});
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
            const {id, login, password} = req.body;
            const user = await userService.updateUserPassword(id, login, password);
            return res.status(201).json({message: `Пользователь ${user.userDto.login} отредактирован`, user: user.userDto});
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