const User = require('../models/User.js');
const express = require('express');

const router = express.Router();

router.get('/show', (req, res) => {
  User.find()
    .then(users => res.status(200).json(users))
    .catch(e => res.status(500).json({
      error: e.message,
    }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params.id;

  User.findById(id)
    .then(user => res.status(200).json(user))
    .catch(e => res.status(500).json({
      error: e.message,
    }));
});

// user to create admin
router.post('/create', (req, res) => {
  const {
    role,
    email,
    password,
  } = req.body;

  const userData = {
    role,
    email,
    password,
  };

  const user = new User(userData);

  user.save()
    .then(savedUser => res.status(201).json(savedUser))
    .catch(e => res.status(500).json({
      error: e.mesesage,
    }));
});

router.post('/update/:id', (req, res) => {
  const {
    username,
    email,
    password,
  } = req.body;

  const update = {
    username,
    email,
    password,
  };

  User.findByIdAndUpdate(req.params.id, update, {
    new: true,
  })
    .then(user => res.status(201).json(user))
    .catch(e => res.status(500).json({
      error: e.message,
    }));
});

module.exports = router;
