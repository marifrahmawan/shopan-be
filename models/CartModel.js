const mongoose = require('mongoose');
const { Schema } = mongoose;

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      color: {
        type: String,
        default: undefined,
      },
      dimension: {
        type: String,
        default: undefined,
      },
      size: {
        type: String,
        default: undefined,
      },
      price: {
        type: Number,
        required: true,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('Cart', cartSchema);
