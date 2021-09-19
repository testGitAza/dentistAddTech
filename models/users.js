'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */


    static associate(models) {
      this.belongsTo(models.organizations, {
        foreignKey: 'organization_id',
        as: 'organizationLink'
      })

        this.hasMany(models.user_roles,{foreignKey:'user_id'})

    }
  }
  users.init({
    surname: DataTypes.STRING,
    name: DataTypes.STRING,
    login: DataTypes.STRING,
    password: DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    organization_id: DataTypes.BIGINT
  }, {
    hooks: {
      afterCreate: (users) => {
        delete users.dataValues.password;
      },
      afterUpdate: (users) => {
        delete users.dataValues.password;
      }
    },
    sequelize,
    modelName: 'users',
  });
  return users;
};