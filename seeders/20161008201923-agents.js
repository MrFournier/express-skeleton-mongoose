'use strict';

var models = require('../models');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return models.Agent.bulkCreate([
      {
        email: 'daniel@example.com',
        password: 'secret'
      },
      {
        email: 'troy@example.com',
        password: 'topsecret'
      }
    ], {individualHooks: true});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Agents', null, {});
  }
};
