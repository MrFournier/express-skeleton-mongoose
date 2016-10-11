'use strict';

var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  const SALT_WORK_FACTOR = 12;

  var Agent = sequelize.define('Agent', {
    email: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isUnique: function (value, next) {
          var self = this;
          Agent.find({ where: {email: value} })
            .then(function (agent) {
              // Reject if a different user wants to use the same email
              if (agent && self.id !== agent.id) {
                return next('That email is taken');
              }
              return next();
            })
            .catch(function (err) {
              return next(err);
            });
        }
      }
    },
    password: {
      type:  DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true 
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      },
      validPassword: function(password, hash, done, agent) {
        bcrypt.compare(password, hash, function(err, isMatch) {
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
