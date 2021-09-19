'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('organization_clients', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        client_name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        client_phone: {
          type: Sequelize.STRING
        },
        client_contacts: {
          type: Sequelize.STRING
        },
        client_description: {
          type: Sequelize.TEXT
        },
        enabled: {
          allowNull: false,
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        organization_id: {
          type: Sequelize.BIGINT,
        },
        create_user_id: {
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
          'organization_clients',
          {
            type: 'foreign key',
            fields: ['organization_id'],
            name: 'organization_id_fkey',
            references: {
              table: 'organizations',
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
  await queryInterface.dropTable('organization_clients');
}
};