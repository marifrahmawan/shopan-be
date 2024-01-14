const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productDetail: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productPicture: [String],
    productBrand: {
      type: String,
      required: true,
    },
    productAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    productStock: {
      type: Number,
      required: true,
    },
    productSize: {
      type: Array,
      default: [String],
    },
    productColor: {
      type: Array,
      default: [String],
    },
    productDimension: {
      type: Array,
      default: [String],
    },
    productSold: {
      type: Number,
      default: 0,
    },
    productReview: [{ body: String, date: Date }],
    productStars: {
      amount: Number,
      percentageStars: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
