const User = require('../models/User.js');
const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

router.get('/show', (req, res) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params.id;

  User.findById(id)
    .then(user => res.status(200).json(user))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});

// user to create admin
router.post('/create', (req, res) => {
  const { role, email, password } = req.body;

  const userData = {
    role,
    email,
    password,
  };

  const user = new User(userData);

  user
    .save()
    .then(savedUser => res.status(201).json(savedUser))
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
});

router.post('/update/:id', (req, res) => {
  let update;
  
  if (req.body.info.email) {
    username = req.body.info.email;
    update = {
      username,
    };
  }

  if (req.body.info.contrasena) {
    const password = req.body.info.contrasena;
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    update = {
      password: hashPass,
    };
  }

  User.findByIdAndUpdate(req.params.id, update, {
    new: true,
  })
    .then(user => res.status(201).json(user))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});

router.get('/getUserAddresses/:id', (req, res, next) => {
  User.findById(req.params.id).populate('address', 'streetName')
    .then(broughtAddresses => res.status(201).json(broughtAddresses))
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
});

module.exports = router;
