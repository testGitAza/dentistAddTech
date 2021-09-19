'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable('masters', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.BIGINT
                },
                master_name: {
                    type: Sequelize.STRING
                },
                master_description: {
                    type: Sequelize.TEXT
                },
                master_logo: {
                    type: Sequelize.STRING
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
                'masters',
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
                'masters',
                {
                    type: 'foreign key',
                    fields: ['create_user_id'],
                    name: 'users_id_fkey',
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
        await queryInterface.dropTable('masters');
    }
};