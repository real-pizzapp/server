const Order = require('../models/Order.js');
const express = require('express');

const router = express.Router();


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
    .then((createdInitialOrder) => {
      res.status(200).json(createdInitialOrder);
    })
    .catch(() => res.status(500));
});

router.patch('/updateOrderWithRestaurant/:id', (req, res) => {
  const  orderId  = req.params.id;
  const  restaurant  = req.body.restaurantId;
  const address = req.body.pickedAddress;
  Order.findByIdAndUpdate(orderId, { $set : { restaurant, address } }, { new: true })
    .then((updatedOrder) => {
      res.status(200).json(updatedOrder);
    })
    .catch(e =>
      res.status(500).json({
        error: e.mesesage,
      }));
});

router.get('/getMyOrder', (req, res) => {
  const userId = res.locals.user._id;
  Order.find({ user: userId }).sort({ created_at: -1 }).limit(1)
    .populate('user restaurant dishes address')
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

router.patch('/uptadeOrderStatus/:id', (req, res, next) => {
  const newStatus = req.body.orderStatus;

  Order.findByIdAndUpdate(req.params.id, { $set: { status: newStatus } }, { upsert: true, new: true })
    .then(updatedOrderStatus => res.status(200).json(updatedOrderStatus))
    .catch(e =>
      res.status(500).json({
        error: e.message,
      }));
});


module.exports = router;
