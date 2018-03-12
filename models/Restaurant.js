const mongoose = require('mongoose');

const { Schema } = mongoose;

const restaurantSchema = new Schema(
  {
    name: String,
    image: String,
    jamonYQuesoPrice: Number,
    cuatroQuesosPrice: Number,
    barbacoaPrice: Number,
    peperonniPrice: Number,
    totalPriceOfOrder: Number,
    postalCodesServedto: Array,
    location: { type: { type: String }, coordinates: [Number] },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

restaurantSchema.index({ location: '2dsphere' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;