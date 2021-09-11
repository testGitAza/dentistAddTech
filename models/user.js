'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      this.hasMany(models.user_role,{foreignKey:'user_id'})
    }
  };
  user.init({
    surname: DataTypes.STRING,
    name: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN
  }, {
    hooks: {
      afterCreate: (user) => {
        delete user.dataValues.password;
      },
      afterUpdate: (user) => {
        delete user.dataValues.password;
      }
    },
    sequelize,
    modelName: 'user',
  });
  return user;
};