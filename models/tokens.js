'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tokens.init({
    refresh_token: DataTypes.TEXT,
    user_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'tokens',
  });
  return tokens;
};