'use strict';

var models = require('../models');

module.exports = {
  up: function (queryInterface, Sequelize) {
    return models.Agent.bulkCreate([{
      email: 'daniel@capitolhill.ca',
      password: 'secret'
    }], {individualHooks: true});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Agent', null, {});
  }
};
