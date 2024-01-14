const User = require('../models/UserModel');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
  try {
    const { fullName, userName, email, password } = req.body;

    const user = User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: 'Email already used' });
    }

    const newUser = new User({
      fullName: fullName,
      userName: userName,
      email: email,
      password: CryptoJS.AES.encrypt(password, process.env.PASS_SECRET).toString(),
    });

    await newUser.save();

    res.status(201).json({ response: 'Success', data: { fullName, userName, email } });
  } catch (error) {
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ errorPath: 'email', message: 'Email not Found, Please register first' });
    }

    const hashPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET).toString(CryptoJS.enc.Utf8);

    if (password !== hashPassword) {
      return res.status(401).json({ errorPath: 'password', message: 'Wrong Password' });
    }

    const accessToken = jwt.sign(
      {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      },
      process.env.TOKEN_SECRET,
      {
        expiresIn: '3d',
      }
    );

    return res.status(200).json({
      message: 'Success',
      data: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        role: user.role,
        accessToken,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};
