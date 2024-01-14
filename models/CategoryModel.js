const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorySchema = new Schema({
  categoryName: {
    type: String,
    require: true,
  },
  categoryImage: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model('Category', categorySchema);
