'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  const SALT_WORK_FACTOR = 12;

  var Agent = sequelize.define('Agent', {
    email: { 
      type: DataTypes.STRING,
      unique: true,
      validate: {
        notNull: true,
        notEmpty: true 
      }
    },
    password: {
      type:  DataTypes.STRING,
      validate: {
        notNull: true,
        notEmpty: true 
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      validPassword: function(password, passwd, done, agent) {
        bcrypt.compare(password, passwd, function(err, isMatch) {
          if (err) console.log(err);
          if (isMatch) {
            return done(null, agent);
          } else {
            return done(null, false);
          }
        });
      }
    }
  });

  /**
   * Encrypt the password.
   *
   * @param Agent model
   * @param Object
   * @param Function
   */
  function hashPassword(agent, options, fn) {
    //Don't hash if password is already hashed
    if (agent.dataValues.password.indexOf('$2a$') === 0) {
      return fn(null, agent);
    }

    var salt = bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
      return salt;
    });

    bcrypt.hash(agent.password, salt, null, function(err, hash) {
      if (err) return next(err);
      agent.password = hash;
      return fn(null, agent);
    });
  }

  Agent.hook('beforeCreate', hashPassword);
  Agent.hook('beforeUpdate', hashPassword);

  return Agent;
};
