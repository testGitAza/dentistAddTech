'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class conference extends Model {
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
      })
    }
    static associate(models) {
      // define association here
      this.hasMany(models.conference_event,{foreignKey:'conference_id'})
    }
  };
  conference.init({
    name: DataTypes.STRING,
    max_count: DataTypes.INTEGER,
    image:DataTypes.STRING,
    enabled: DataTypes.BOOLEAN,
    create_user_id: DataTypes.BIGINT

  }, {
    sequelize,
    modelName: 'conference',
  });
  return conference;
};