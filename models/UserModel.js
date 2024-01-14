const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      min: [3, `Full name minimum 3 characters in length`],
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      min: [3, `User name minimum 3 characters in length`],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
      default: '',
    },
    dateOfBirth: {
      type: Date,
      required: false,
      default: '',
    },
    role: {
      type: String,
      default: 'user',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
