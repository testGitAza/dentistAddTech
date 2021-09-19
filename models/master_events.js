'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class master_events extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.users, {
        foreignKey: 'create_user_id',
        as: 'ownerLink'
      });
      this.belongsTo(models.masters, {
        foreignKey: 'master_id',
        as: 'masterLink'
      });
      this.belongsTo(models.organization_clients, {
        foreignKey: 'organization_client_id',
        as: 'organizationClientLink'
      });
      this.belongsTo(models.organizations, {
        foreignKey: 'organization_id',
        as: 'organizationLink'
      })

    }
  }
  master_events.init({
    event_start: DataTypes.DATE,
    event_end: DataTypes.DATE,
    event_description: DataTypes.TEXT,
    event_contact: DataTypes.STRING,
    event_sum: DataTypes.FLOAT,
    color: DataTypes.STRING,
    organization_client_id: DataTypes.BIGINT,
    master_id: DataTypes.BIGINT,
    organization_id: DataTypes.BIGINT,
    create_user_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'master_events',
  });
  return master_events;
};