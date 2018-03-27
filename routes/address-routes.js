const Address = require('../models/Address.js');
const User = require('../models/User.js');
const express = require('express');

const router = express.Router();


router.post('/create', (req, res) => {
  const { userId, streetName, floor, postalCode, coordinates } = req.body;
  const addressData = {
    streetName,
    floor,
    postalCode,
    coordinates,
  };

  const address = new Address(addressData);

  address
    .save()
    .then((savedAddress) => {
      User.findByIdAndUpdate(
        userId,
        { $push: { address: savedAddress._id } },
        { new: true },
      ).then(updatedUser => res.status(200).json(updatedUser));
    })
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
});

router.post('/addAddress', (req, res, next) => {
  const { userId, streetName, floor, postalCode, coordinates } = req.body;
  const addressData = {
    streetName,
    floor,
    postalCode,
    coordinates,
  };

  const address = new Address(addressData);

  address
    .save()
    .then((savedAddress) => {
      User.findByIdAndUpdate(
        userId,
        { $push: { address: savedAddress._id } },
        { new: true },
      ).then(updatedUser => res.status(200).json(updatedUser));
    })
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
})

router.get('/getAddress/:id', (req, res, next) => {
  Address.findById(req.params.id)
    .then(foundAddress => res.status(200).json(foundAddress))
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
});

module.exports = router;
