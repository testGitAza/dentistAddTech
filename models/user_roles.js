'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: 'user_id',
        as: 'userLink'
      })
    }
    static associate(models) {
      // define association here
      this.belongsTo(models.roles, {
        foreignKey: 'role_id',
        as: 'roleLink'
      })
    }
  };
  user_roles.init({
    user_id: DataTypes.BIGINT,
    role_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'user_roles',
  });
  return user_roles;
};