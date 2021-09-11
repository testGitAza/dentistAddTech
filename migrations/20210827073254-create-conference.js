'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('conferences', {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.BIGINT
          },
          name: {
              type: Sequelize.STRING
          },
          max_count: {
              type: Sequelize.BIGINT
          },
          image: {
              type: Sequelize.STRING
          },
          create_user_id: {
              type: Sequelize.BIGINT
          },
          enabled: {
              allowNull: false,
              type: Sequelize.BOOLEAN,
              defaultValue: false
          },
          createdAt: {
              allowNull: false,
              type: Sequelize.DATE
          },
          updatedAt: {
              allowNull: false,
              type: Sequelize.DATE
          }
      }, transaction);

      await queryInterface.addConstraint(
          'conferences',
          {
            type: 'foreign key',
            fields: ['create_user_id'],
            name: 'users_conferences_id_fkey',
            references: {
              table: 'users',
              field: 'id'
            },
            transaction
          }
      );

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('conferences');
  }
};