'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class organization_clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.organizations, {
        foreignKey: 'organization_id',
        as: 'organizationLink'
      });
      this.hasMany(models.master_events, {foreignKey: 'organization_client_id'})
    }
  }

  organization_clients.init({
    client_name: DataTypes.STRING,
    client_phone: DataTypes.STRING,
    client_contacts: DataTypes.STRING,
    client_description: DataTypes.TEXT,
    enabled: DataTypes.BOOLEAN,
    organization_id: DataTypes.BIGINT,
    create_user_id: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'organization_clients',
  });
  return organization_clients;
};