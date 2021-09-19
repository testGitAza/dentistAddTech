'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn('masters', 'master_start', { type: Sequelize.STRING }, transaction);
            await queryInterface.addColumn('masters', 'master_end', { type: Sequelize.STRING }, transaction);

            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }
};