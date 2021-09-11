'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('conference_events', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.BIGINT
        },
        title: {
          type: Sequelize.STRING
        },
        start: {
          type: Sequelize.DATE
        },
        end: {
          type: Sequelize.DATE
        },
        description: {
          type: Sequelize.TEXT
        },
          seating_type: {
              type: Sequelize.STRING
          },
          format: {
              type: Sequelize.STRING
          },
          seating_count: {
              type: Sequelize.INTEGER
          },
          contact: {
              type: Sequelize.STRING
          },
          color: {
            type: Sequelize.STRING
        },
        parent_id: {
          type: Sequelize.BIGINT
        },
        conference_id: {
          type: Sequelize.BIGINT
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
          'conference_events',
          {
            type: 'foreign key',
            fields: ['create_user_id'],
            name: 'users_conference_events_id_fkey',
            references: {
              table: 'users',
              field: 'id'
            },
            transaction
          }
      );
      await queryInterface.addConstraint(
          'conference_events',
          {
            type: 'foreign key',
            fields: ['conference_id'],
            name: 'conferences_conference_events_id_fkey',
            references: {
              table: 'conferences',
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
    await queryInterface.dropTable('conference_events');
  }
};