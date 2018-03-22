const mongoose = require('mongoose');

const { Schema }   = mongoose;

const userSchema = new Schema({
  username: String,
  email: { type: String, unique: true, required: true },
  password: String,
  address: [{ type: Schema.Types.ObjectId, ref: 'Address' }],
  assignedRestaurant: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  role: {
    type: String,
    enum: ['admin', 'restaurant', 'user'],
    default: 'user',
  },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
