'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable('master_events', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.BIGINT
                },
                event_start: {
                    type: Sequelize.DATE
                },
                event_end: {
                    type: Sequelize.DATE
                },
                event_description: {
                    type: Sequelize.TEXT
                },
                event_contact: {
                    type: Sequelize.STRING
                },
                event_sum: {
                    type: Sequelize.FLOAT
                },
                color: {
                    type: Sequelize.STRING
                },
                organization_client_id: {
                    type: Sequelize.BIGINT
                },
                master_id: {
                    type: Sequelize.BIGINT
                },
                organization_id: {
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
                'master_events',
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

            await queryInterface.addConstraint(
                'master_events',
                {
                    type: 'foreign key',
                    fields: ['organization_client_id'],
                    name: 'organization_client_id_fkey',
                    references: {
                        table: 'organization_clients',
                        field: 'id'
                    },
                    transaction
                }
            );

            await queryInterface.addConstraint(
                'master_events',
                {
                    type: 'foreign key',
                    fields: ['create_user_id'],
                    name: 'create_users_id_fkey',
                    references: {
                        table: 'users',
                        field: 'id'
                    },
                    transaction
                }
            );
            await queryInterface.addConstraint(
                'master_events',
                {
                    type: 'foreign key',
                    fields: ['master_id'],
                    name: 'masters_id_fkey',
                    references: {
                        table: 'masters',
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
        await queryInterface.dropTable('master_events');
    }
};