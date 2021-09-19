'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class organizations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.users,{foreignKey:'organization_id'})
    }
  }
  organizations.init({
    organization_name: DataTypes.STRING,
    organization_logo: DataTypes.INTEGER,
    enabled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'organizations',
  });
  return organizations;
};