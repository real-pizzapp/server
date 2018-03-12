const Restaurant = require('../models/Restaurant.js');
const User = require('../models/User.js');
const Order = require('../models/Order.js');
const express = require('express');

const router = express.Router();

router.get('/getNearRestaurants', (req, res) => {
  const userId = res.locals.user._id;
  Order.find({ user: userId }).then((infoSobrePedido) => {
    const { quantity } = infoSobrePedido[0];
    User.findById(userId)
      .populate('address')
      .then((user) => {
        Restaurant.find({ postalCodesServedto: { $in: [user.address[0].postalCode.toString()] } }).limit(3).then((restaurantsWhichServeMe) => {
          const restaurants = restaurantsWhichServeMe.map((singleRestaurant) => {
            const totalJamonYQueso = singleRestaurant.jamonYQuesoPrice * quantity.jamonYQuesoPrice || 0;
            const totalCuatroQuesos = singleRestaurant.cuatroQuesosPrice * quantity.cuatroQuesosPrice || 0;
            const totalBarbacoa = singleRestaurant.barbacoaPrice * quantity.barbacoaPrice || 0;
            const totalPepperoni = singleRestaurant.peperonniPrice * quantity.peperonniPrice || 0;
            const orderTotalPrice = totalJamonYQueso + totalCuatroQuesos + totalBarbacoa + totalPepperoni;
            const orderInRestaurant = singleRestaurant;
            orderInRestaurant.totalPriceOfOrder = orderTotalPrice;
            return orderInRestaurant;
          });
          res.status(200).json(restaurants);
        })
          .catch(e => res.status(500).json(e));
      });
  });
});

router.post('/sendRestInfo', (req, res) => {
  const { name, image, jamonYQuesoPrice, cuatroQuesosPrice, barbacoaPrice, peperonniPrice } = req.body;
  const postalCodesServedto = req.body.postalCodesServedto.replace(/\s+/g, '').split(',');
  const restaurantData = { name, image, jamonYQuesoPrice, cuatroQuesosPrice, barbacoaPrice, peperonniPrice, postalCodesServedto };
  const restaurant = new Restaurant(restaurantData);
  restaurant
    .save()
    .then(savedRest => res.status(200).json(savedRest))
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
});

router.post('/create', (req, res) => {
  const { name, image } = req.body;
  const restaurantData = {
    name,
    image,
  };
  const restaurant = new Restaurant(restaurantData);

  restaurant
    .save()
    .then(singleRestaurant => res.status(200).json(singleRestaurant))
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
});

router.post('/update/:id', (req, res) => {
  const { name, image } = req.body;

  const update = {
    name,
    image,
  };

  Restaurant.findByIdAndUpdate(req.params.id, update, {
    new: true,
  })
    .then(restaurant => res.status(200).json(restaurant))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  Restaurant.findById(id)
    .then(restaurant => res.status(200).json(restaurant))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});

module.exports = router;

// $maxDistance is expressed in meters
// OJO, las direcciones me trae la primera posicion del array
// User.findById(userId)
//   .populate('address')
//   .then((user) => {
//     Restaurant.find({
//       location: {
//         $near: {
//           $geometry: user.address[0].coordinates,
//           $maxDistance: 1000000,
//         },
//       },
//     })
//       .then((restaurants) => {
//         res.status(200).json(restaurants);
//       })
//       .catch(e =>
//         res.status(500).json({
//           error: e.message,
//         }));
//   });