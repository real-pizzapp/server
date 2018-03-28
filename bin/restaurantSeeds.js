const Restaurant = require('../models/Restaurant');

module.exports = () => {
  const restaurants = [{
    name: 'telepizza',
    jamonYQuesoPrice: 1,
    cuatroQuesosPrice: 2,
    barbacoaPrice: 3,
    peperonniPrice: 4,
    totalPriceOfOrder: 0,
    postalCodesServedto: [29036, 28037],
    telephoneNumber: 915614153,
  },
  {
    name: 'dominos',
    jamonYQuesoPrice: 4,
    cuatroQuesosPrice: 3,
    barbacoaPrice: 2,
    peperonniPrice: 1,
    totalPriceOfOrder: 0,
    postalCodesServedto: [29036, 28037],
    telephoneNumber: 915614153,

  },
  {
    name: 'tagiatella',
    jamonYQuesoPrice: 10,
    cuatroQuesosPrice: 20,
    barbacoaPrice: 30,
    peperonniPrice: 40,
    totalPriceOfOrder: 0,
    postalCodesServedto: [29036, 28037],
    telephoneNumber: 915614153,

  }];
  return Restaurant.create(restaurants);
};