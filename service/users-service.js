const {user,user_role,role} = require('../models');
const ApiError = require('../exceptions/api-error');
const bcrypt = require('bcryptjs');
const UserDto = require('../dtos/user-dto');
const tokenService = require('../service/token-service');
const roleService = require('../service/roles-service');
class UsersService {


    async getAllUsers() {
         const userData = await user.findAll({
            attributes:{exclude:  ['password'], include:['id','login','surname', 'name', 'surname', 'enabled', 'createdAt', 'updatedAt'] },
            include:[
                {
                    model: user_role, nest:true, raw:true, attributes:['id'],
                    include:[
                        { model: role, as: 'roleLink', paranoid: true }
                    ]
                }
            ]
        });
        return userData
    }

    async registration(login, password,surname,name,enabled,roles){
        const candidate = await user.findOne({ where: { login: login } });
        if(candidate){
            throw ApiError.BadRequest(`Пользователь с таким логином ${login} уже существует`)
        }
        const hashedPassword = await bcrypt.hash(password,12);

        const userData =  await user.create({
            surname: surname, name:name, login:login, password:hashedPassword,enabled:enabled
        });
        const rolesData = [];
        await roles.forEach(role => { //todo
             roleService.createUserRoles(userData.id, role.id);
            rolesData.push(role)
        });

        const userDto = new UserDto(userData); //surname, name, login, enabled, createdAt,  updatedAt
        userDto.roles = rolesData; //todo
        return {userDto}
    }

    async updateUser(id, login, surname,name, enabled,roles){
        const userData = await user.findOne({ where: { login: login, id: id}});
        if(!userData){
            throw ApiError.BadRequest(`Пользователя с таким логином ${login} не существует`)
        }
        userData.surname = surname;
        userData.name = name;
        userData.enabled = enabled;
        await userData.save();
        await roleService.deleteUserRoles(userData.id); //todo
        const rolesData = [];
        await roles.forEach(role => { //todo
            roleService.createUserRoles(userData.id, role.id);
            rolesData.push(role)
        });
        const userDto = new UserDto(userData);
        userDto.roles = rolesData; //todo
        return {userDto}
    }

    async updateUserPassword(id, login, password){
        const userData = await user.findOne({ where: { login: login, id: id }});
        if(!userData){
            throw ApiError.BadRequest(`Пользователя с таким логином ${login} не существует`)
        }
        userData.password = await bcrypt.hash(password,12);
        await userData.save();
        const userDto = new UserDto(userData);
        return {userDto}
    }

    async login(login, password){
        const userData = await user.findOne({
            where: { login: login, enabled: true },
            include:[
                    {
                        model: user_role,
                        include:[
                            { model: role, as: 'roleLink' }
                        ]
                    }
                ]
        });

        if(!userData){
            throw ApiError.BadRequest('Неверный логин или пароль')
        }
        if(!userData && !userData.user_roles && userData.user_roles<1 && !userData.user_roles[0].roleLink && !!userData.user_roles[0].roleLink.role_name){
            throw ApiError.ForbiddenError()
        }
        const isMatch =await bcrypt.compare(password,userData.password);
        if(!isMatch){
            throw ApiError.BadRequest(`Неверный логин или пароль`)
        }
        const userDto = new UserDto(userData);
        const roles = [];
        userData.user_roles.forEach(role => {
            roles.push(role.roleLink.role_name);
        });
        userDto.roles = roles;
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
        const currentUser = await user.findOne({where:{id:userData.id}});
        const userDto = new UserDto(currentUser);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        return await tokenService.removeToken(refreshToken);
    }
}

module.exports = new UsersService();
