const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const nodemailer = require('nodemailer');

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


authRoutes.post('/sendEmail', (req, res) => {
  const { email } = req.body;
  const url = 'http://localhost:8100/ionic-lab';
  User.findOne({ username: email })
    .then((foundUser) => {
      console.log('encontrado este usuario =========>')
      console.log(foundUser)
      if (foundUser !== null) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'pizzappcompany@gmail.com',
            pass: 'Pizzappcompany123',
          },
        });

        const mailOptions = {
          from: 'pizzappcompany@gmail.com',
          to: email, // list of receivers
          subject: 'Password ', // Subject line
          html: `<p>Por favor, para restablecer tu contraseña, haz click en el siguiente link: <a>${url}</a> </p>`,
        };


        transporter.sendMail(mailOptions, (err, info) => {
          if (err) { console.log(err); } else { console.log(info); }
        });
        res.status(200).json({ success: 'email enviado con exito' });
      } else {
        console.log('entro aqui porque no hay email');
        res.status(200).json({ error: 'no hay un email asociado' });
      }
    });
});

// authRoutes.post('/recoverPassword', (req, res) => {
//   let newPassword = Array(10).fill(1);
//   newPassword = newPassword.map((e) => {
//     return String.fromCharCode(Math.floor(Math.random() * 10));
//   }).join();
//   console.log(newPassword);
//   User.findOne({ username: req.body.username })
//     .then(user => res.json(user));
// });


module.exports = authRoutes;
