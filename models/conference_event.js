'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conference_event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.user, {
        foreignKey: 'create_user_id',
        as: 'ownerLink'
      });
      this.belongsTo(models.conference, {
        foreignKey: 'conference_id',
        as: 'conferenceId'
      })

    }
  };
  conference_event.init({
    title: DataTypes.STRING,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    description: DataTypes.TEXT,
    seating_type: DataTypes.STRING,
    format: DataTypes.STRING,
    seating_count: DataTypes.INTEGER,
    contact: DataTypes.STRING,
    color: DataTypes.STRING,


    parent_id: DataTypes.BIGINT,
    conference_id: DataTypes.BIGINT,
    create_user_id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'conference_event',
  });
  return conference_event;
};