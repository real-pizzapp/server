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

router.get('/getMyOrder/:id', (req, res) => {
  const userId = res.locals.user._id;

  Order.find({ user: userId }).sort({ created_at: -1 }).limit(1)
    .populate('user restaurant dishes')
    .then(myOrder => res.status(200).json(myOrder))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});

router.get('/getAllOrders', (req, res, next) => {
  Order.find({})
    .then(allOrders => res.status(200).json(allOrders))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});

router.get('/getAllOrders/:id', (req, res, next) => {
  Order.findById(req.params.id)
    .populate('user restaurant')
    .then(singleOrder => res.status(200).json(singleOrder))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});

router.post('/uptadeOrderStatus/:id', (req, res, next) => {
  console.log('entro en la ruta');
  const newStatus = req.body.orderStatus;

  Order.findByIdAndUpdate(req.params.id, { status: newStatus }, { new: true })
    .then(updatedOrderStatus => res.status(200).json(updatedOrderStatus))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});


module.exports = router;
