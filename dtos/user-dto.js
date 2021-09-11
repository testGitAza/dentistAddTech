module.exports = class UserDto {
    surname;
    name;
    login;
    enabled;
    createdAt;
    updatedAt;
    roles;

    constructor(model) {
        this.id = model.id;
        this.surname = model.surname;
        this.name = model.name;
        this.login = model.login;
        this.enabled = model.enabled;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
        this.roles = model.roles;

    }
};
