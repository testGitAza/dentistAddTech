'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class masters extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: 'create_user_id',
        as: 'ownerLink'
      })
    }
    static associate(models) {
      this.belongsTo(models.organizations, {
        foreignKey: 'organization_id',
        as: 'organizationLink'
      })
    }
    static associate(models) {
      this.hasMany(models.master_events,{foreignKey:'master_id'})
    }
  }

  masters.init({
    master_name: DataTypes.STRING,
    master_description: DataTypes.TEXT,
    master_start: DataTypes.STRING,
    master_end: DataTypes.STRING,
    master_logo:DataTypes.STRING,
    color:DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    organization_id: DataTypes.BIGINT,
    create_user_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'masters',
  });
  return masters;
};