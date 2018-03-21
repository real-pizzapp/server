const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const authRoutes = express.Router();

authRoutes.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: 'Provide username and password' });
    return;
  }

  User.findOne({ username }, '_id')
    .then((user) => {
      if (user) {
        res.status(400).json({ message: 'The username already exists' });
        return;
      }

      const salt     = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      new User({
        username,
        password: hashPass,
      })
        .save()
        .then((newUser) => {
          req.login(newUser, (err) => {
            if (err) {
              res.status(500).json({ message: 'Something went wrong' });
              return;
            }
            req.user = newUser;
            res.status(200).json(req.user);
          });
        });
    })
    .catch(() => {
      res.status(500).json({ message: 'Something went wrong' });
    });
});


authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, theUser, failureDetails) => {
    if (err) {
      res.status(500).json({ message: 'Something went wrong' });
      return;
    }

    if (!theUser) {
      res.status(401).json(failureDetails);
      return;
    }

    req.login(theUser, (error) => {
      if (error) {
        res.status(500).json({ message: 'Something went wrong' });
        return;
      }

      // We are now logged in (notice req.user)
      res.status(200).json(req.user);
    });
  })(req, res, next);
});

authRoutes.get('/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Success' });
});

authRoutes.get('/loggedin', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  res.status(403).json({ message: 'Unauthorized' });
});


module.exports = authRoutes;
