const User = require('../models/User');
const bcrypt = require('bcrypt');

const adminPassword = '1234';
const salt = bcrypt.genSaltSync(10);
const hashPass = bcrypt.hashSync(adminPassword, salt);

module.exports = () => {
  const user = [{
    username: 'admin',
    password: hashPass,
    role: 'admin',

  }];
  return User.create(user);
};