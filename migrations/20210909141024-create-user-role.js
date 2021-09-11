'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.createTable('user_roles', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.BIGINT
                },
                user_id: {
                    type: Sequelize.BIGINT
                },
                role_id: {
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
                'user_roles',
                {
                    type: 'foreign key',
                    fields: ['user_id'],
                    name: 'user_id_fkey',
                    references: {
                        table: 'users',
                        field: 'id'
                    },
                    transaction
                }
            );

            await queryInterface.addConstraint(
                'user_roles',
                {
                    type: 'foreign key',
                    fields: ['role_id'],
                    name: 'role_id_fkey',
                    references: {
                        table: 'roles',
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
        await queryInterface.bulkInsert('user_roles', [{
            user_id: 1,
            role_id: 1,
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('user_roles');
    }
};