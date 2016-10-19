'use strict';

const bcrypt = require('bcrypt-nodejs');

module.exports = function(mongoose) {
  const Schema = mongoose.Schema;
  const Types = Schema.Types;

  const AgentSchema = new Schema({
    email: {
      type: Types.String,
      trim: true,
      required: [true, 'No email supplied'],
      unique: [true, 'That email is taken'],
      empty: [false, 'No email supplied'],
    },
    password: {
      type: Types.String,
      trim: true,
      required: [true, 'No password supplied'],
      empty: [false, 'No password supplied'],
    },
  }, {
      timestamps: true
  });


  AgentSchema.pre('save', function(next) {
    var agent = this;
    if (agent.isModified('password')){
      bcrypt.hash(agent.password, null, null, function(err, hash){
        if (err){
          next();
        }
        agent.password = hash;
        next();
      });
    }
    next();
  });

  AgentSchema.path('email').validate(function(value, done) {
    this.model('Agent').count({ email: value }, function(err, count) {
      if (err) {
        return done(err);
      } 
      // If `count` is greater than zero, "invalidate"
      done(!count);
    });
  }, 'That email is taken');

  AgentSchema.statics.validPassword = function(password, hash, done, agent) {
    bcrypt.compare(password, hash, function(err, isMatch) {
      if (err) console.log(err);
      if (isMatch) {
        return done(null, agent);
      } else {
        return done(null, false);
      }
    });
  };

  return AgentSchema;
};

