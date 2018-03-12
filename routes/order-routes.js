const Order = require('../models/Order.js');
const express = require('express');

const router = express.Router();

router.get('/show', (req, res) => {
  console.log('entro');
});

router.post('/createOrder', (req, res) => {
  const user = res.locals.user._id;
  const nonFormattedOrder = req.body.initialPizzas;
  const finalPizzas = {};
  nonFormattedOrder.forEach((orderItem) => {
    const arrWithNumberAndNameToCheck = Object.values(orderItem).splice(2);
    finalPizzas[arrWithNumberAndNameToCheck[1]] = arrWithNumberAndNameToCheck[0];
  });

  const initialOrderData = { user, quantity: finalPizzas };

  const order = new Order(initialOrderData);
  order
    .save()
    .then(createdInitialOrder => res.status(200).json(createdInitialOrder))
    .catch(() => res.status(500));
});

router.post('/updateOrderWithRestaurant', (req, res) => {
  const { userId } = req.body;
  const { restaurantId } = req.body;

  Order.update(
    { user: userId },
    { $set: { restaurant: restaurantId } },
    { new: true },
  )
    .then(updatedOrder => res.status(200).json(updatedOrder))
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
});

router.get('/getMyOrder', (req, res) => {
  const userId = res.locals.user._id;

  Order.find({ user: userId }).sort().limit(1)
    .populate('user restaurant dishes')
    .then(myOrder => {
      console.log(myOrder)
      res.status(200).json(myOrder)})
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});


module.exports = router;
