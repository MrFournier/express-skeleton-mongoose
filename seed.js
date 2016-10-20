'use strict';

var models = require('./models');
var seeder = require('mongoose-seeder'),
    data = require('./migrations/data.json');

models.once('open', function() {
  seeder.seed(data, {dropCollections: true}).then(function(dbData) {
    // The database objects are stored in dbData
    console.log('DONE: ' + JSON.stringify(dbData));
    process.exit(0);
  }).catch(function(err) {
    // handle error
    console.log('SEEDER ERROR: ' + err);
    process.exit(1);
  });
});



