const {users,user_roles, roles,organizations} = require('../models');
const ApiError = require('../exceptions/api-error');
const bcrypt = require('bcryptjs');
const UserDto = require('../dtos/user-dto');
const tokenService = require('../service/token-service');
const roleService = require('../service/roles-service');
class UsersService {


    async getAllUsers() {
        return await users.findAll({
            attributes:{exclude:  ['password'],include:['id','login','surname', 'name', 'surname', 'enabled', 'createdAt', 'updatedAt'] },
            include:[
                {
                    model: user_roles, attributes:['id'],
                    include:[
                        { model: roles, as: 'roleLink' }
                    ]
                },
                {model: organizations, as: 'organizationLink'}
            ]
        });
    }

    async getUsersByOrganizationId(organization_id) {
        return await users.findAll({
            where:{organization_id:organization_id },
            attributes:{ exclude:  ['password'],include:['id','login','organization_id','surname', 'name', 'surname', 'enabled', 'createdAt', 'updatedAt'] },
            include:[
                {
                    model: user_roles, attributes:['id'],
                    include:[
                        { model: roles, as: 'roleLink' }
                    ]
                },
                {model: organizations, as: 'organizationLink'}
            ]
        });
    }

    async getCurrentUser(id) {
        return await users.findOne({
            where:{id:id },
            attributes:{ exclude:  ['password'],include:['id','login','organization_id','surname', 'name', 'surname', 'enabled', 'createdAt', 'updatedAt'] }
        });
    }

    async registration(login, password,surname,name,enabled,roles, organization_id){
        const candidate = await users.findOne({ where: { login: login }   });
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с таким логином ${login} уже существует`)
        }
        const hashedPassword = await bcrypt.hash(password,12);

        const userData =  await users.create({
            surname: surname, name:name, login:login, password:hashedPassword,enabled:enabled,organization_id:organization_id
        });
        const rolesData = [];
        await roles.forEach(role => { //todo
             roleService.createUserRoles(userData.id, role.id);
            rolesData.push(role)
        });

        const userDto = new UserDto(userData); //surname, name, login, enabled, createdAt,  updatedAt
        userDto.roles = rolesData; //todo
        return userDto
    }

    async updateUser(id, login, surname,name, enabled,roles,organization_id){
        const userData = await users.findOne(
            {
                where: { login: login, id: id},
                include:[
                    {model: organizations, as: 'organizationLink'}
                ]
            });
        if(!userData){
            throw ApiError.BadRequest(`Пользователя с таким логином ${login} не существует`)
        }
        userData.surname = surname;
        userData.name = name;
        userData.enabled = enabled;
        userData.organization_id = organization_id;
        await userData.save();
        await roleService.deleteUserRoles(userData.id); //todo
        const rolesData = [];
        await roles.forEach(role => { //todo
            roleService.createUserRoles(userData.id, role.id);
            rolesData.push(role)
        });
        const userDto = new UserDto(userData);
        userDto.roles = rolesData; //todo
        return userDto
    }

    async updateUserPassword(id, password){
        const userData = await users.findOne({ where: {  id: id }});
        if(!userData){
            throw ApiError.BadRequest(`Пользователя с таким логином не существует`)
        }
        userData.password = await bcrypt.hash(password,12);
        await userData.save();
        return new UserDto(userData);
    }

    async login(login, password){
        const userData = await users.findOne({
            where: {login: login, enabled: true},
            include: [
                {
                    model: user_roles,
                    include:[
                        { model: roles, as: 'roleLink' }
                    ]
                },
                {model: organizations, as: 'organizationLink'}
            ]
        });
        if(!userData){
            throw ApiError.BadRequest('Неверный логин или пароль')
        }
        if(!userData && !userData.user_roles && userData.user_roles<1){
            throw ApiError.ForbiddenError()
        }
        const isMatch =await bcrypt.compare(password,userData.password);
        if(!isMatch){
            throw ApiError.BadRequest(`Неверный логин или пароль`)
        }
        const userDto = new UserDto(userData);
        const rolesArr = [];
        userData.user_roles.forEach(role => {
            rolesArr.push(role.roleLink.role_name);
        });
        userDto.roles = rolesArr;
        userDto.organizationId = userData.organizationLink.id;
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: {...userDto}}
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const currentUser = await users.findOne(
            {
                where:{id:userData.id,enabled: true},
                include: [
                    {
                        model: user_roles,
                        include:[
                            { model: roles, as: 'roleLink' }
                        ]
                    },
                    {model: organizations, as: 'organizationLink'}
                ]
            });
        const userDto = new UserDto(currentUser);
        const rolesArr = [];
        currentUser.user_roles.forEach(role => {
            rolesArr.push(role.roleLink.role_name);
        });
        userDto.roles = rolesArr;
        userDto.organizationId = currentUser.organizationLink.id;
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: {...userDto}}
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }
}

module.exports = new UsersService();
