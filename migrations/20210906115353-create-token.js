'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('tokens', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        refresh_token: {
          type: Sequelize.TEXT
        },
        user_id: {
          type: Sequelize.BIGINT
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
          'tokens',
          {
            type: 'foreign key',
            fields: ['user_id'],
            name: 'users_tokens_id_fkey',
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