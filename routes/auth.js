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
  passport.authenticate('local', (err, user, failureDetails) => {
    if (err) { return res.status(500).json({ message: 'Something went wrong' }); }

    if (!user) {
      return res.status(401).json(failureDetails);
    }

    req.login(user, (error) => {
      if (error) { return res.status(500).json({ message: 'Something went wrong' }); }
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
  //  generate random 5-letter word
  const randomWord = (function makeid() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)); }
    return text;
  }());
  //  hash random word
  const salt     = bcrypt.genSaltSync(10);
  const hashEmail = bcrypt.hashSync(randomWord, salt);

  User.findOneAndUpdate({ username: email }, { $set : { password: hashEmail } }, { new: true })
    .then((foundUser) => {
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
          subject: 'NUEVA CONTRASEÑA', // Subject line
          html: `<p>Tu nueva contraseña para el email ${email} es ${randomWord}. Por cuestiones de seguridad, recomendamos que la cambies en cuanto inicies sesión<p>`,
        };

        transporter.sendMail(mailOptions, (err, info) => {
          if (err) { console.log(err); } else { console.log(info); }
        });
        res.status(200).json({ success: 'email enviado con exito' });
      } else {
        res.status(200).json({ error: 'no hay un email asociado' });
      }
    });
});

module.exports = authRoutes;
