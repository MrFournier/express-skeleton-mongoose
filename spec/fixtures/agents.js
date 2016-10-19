'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const bcrypt = require('bcrypt-nodejs');

exports.Agent = {
  dan: {
    _id: new ObjectId(),
    email: 'daniel@example.com',
    password: bcrypt.hashSync('secret')
  },
  troy: {
    _id: new ObjectId(),
    email: 'troy@example.com',
    password: bcrypt.hashSync('topsecret')
  }
};
