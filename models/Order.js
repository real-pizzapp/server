const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    restaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
    address: { type: Schema.Types.ObjectId, ref: 'Address' },
    quantity: Object,
    status: {
      type: String,
      enum: ['accepted', 'pending', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  },
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
