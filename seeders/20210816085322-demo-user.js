'use strict';
const bcrypt = require('bcryptjs');
module.exports = {


  async up(queryInterface, Sequelize) {

      const user = await queryInterface.rawSelect('users', {
          where: {
              login: 'admin',
          },
      }, ['id']);
      const hashedPassword = await bcrypt.hash('admin',12);
      if(!user) {
          return queryInterface.bulkInsert('users', [{
              surname: 'admin',
              name: 'admin',
              login: 'admin',
              password:  hashedPassword,
              enabled:true,
              createdAt: new Date(),
              updatedAt: new Date()
          }]);
      }
},
down: (queryInterface, Sequelize) => {
  return queryInterface.bulkDelete('users', null, {});
}
};