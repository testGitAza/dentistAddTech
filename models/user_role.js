'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'user_id',
        as: 'userLink'
      })
    }
    static associate(models) {
      // define association here
      this.belongsTo(models.role, {
        foreignKey: 'role_id',
        as: 'roleLink'
      })
    }
  };
  user_role.init({
    user_id: DataTypes.BIGINT,
    role_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'user_role',
  });
  return user_role;
};