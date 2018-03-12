const mongoose = require('mongoose');

const { Schema } = mongoose;

const addressSchema = new Schema({
  streetName: String,
  floor: String,
  postalCode: Number,
  coordinates: { type: { type: String }, coordinates: [Number] },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});
addressSchema.index({ location: '2dsphere' });

const Address = mongoose.model('Address', addressSchema);
module.exports = Address;
