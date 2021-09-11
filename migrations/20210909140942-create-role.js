'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      role_name: {
        type: Sequelize.STRING
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

    await queryInterface.bulkInsert('roles', [{
      role_name: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      role_name: 'USER',
      createdAt: new Date(),
      updatedAt: new Date()
    }], transaction);

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