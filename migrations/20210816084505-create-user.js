'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      surname: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      login: {
        type: Sequelize.STRING
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
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

    await queryInterface.bulkInsert('users', [{
      surname: 'admin',
      name: 'admin',
      login: 'admin',
      password:  '$2a$12$Ro98Ldf5ANLO3uSSHBF.5OWO5/8IqJRRJHLsg/IwjeQuz5LGTXVpi',
      enabled: true,
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