const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');

/** 
  @type {import('express').RequestHandler} 
*/
exports.getUserCart = async (req, res, next) => {
  try {
    const userCart = await Cart.findOne({ user: req.user._id }).populate('products.productId');

    if (!userCart) {
      return res.status(200).json({ message: 'success', data: null });
    }

    const filteredCart = userCart.products.filter((cart) => cart.productId !== null);
    userCart.products = filteredCart;
    const totalCartPrice = filteredCart.reduce((acc, currVal) => currVal.totalPrice + acc, 0);

    return res.status(200).json({ message: 'success', data: { ...userCart._doc, totalCartPrice } });
  } catch (error) {
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};

/** 
  @type {import('express').RequestHandler} 
*/
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, size, color, dimension } = req.body;
    const product = await Product.findById(productId);
    const userCart = await Cart.findOne({ user: req.user._id });

    if (!userCart) {
      const newUserCart = new Cart({
        user: req.user._id,
        products: [
          {
            productId: productId,
            quantity: quantity,
            color: color,
            dimension: dimension,
            size: size,
            price: product.productPrice,
            totalPrice: product.productPrice * quantity,
          },
        ],
      });

      await newUserCart.save();
      return res.status(201).json({ message: 'Added to cart' });
    }

    const productIndex = userCart.products.findIndex(
      (e) => e.productId.toString() === productId && e.color === color && e.dimension === dimension && e.size === size
    );

    if (productIndex >= 0) {
      userCart.products[productIndex].quantity += quantity;
      userCart.products[productIndex].totalPrice += product.productPrice * quantity;
      await userCart.save();

      return res.status(201).json({ message: 'Added to cart' });
    } else {
      userCart.products.push({
        productId,
        quantity,
        color: color,
        dimension: dimension,
        size: size,
        price: product.productPrice,
        totalPrice: product.productPrice * quantity,
      });
      await userCart.save();

      return res.status(201).json({ message: 'Added to cart' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};

/** 
  @type {import('express').RequestHandler} 
*/
exports.reduceFromCart = async (req, res, next) => {
  try {
    const { productId, color, size, dimension } = req.body;

    const userCart = await Cart.findOne({ user: req.user._id });

    const productIndex = userCart.products.findIndex(
      (e) =>
        e.productId._id.toString() === productId && e.color === color && e.size === size && e.dimension === dimension
    );

    if (userCart.products[productIndex].quantity === 1) {
      userCart.products.splice(productIndex, 1);

      await userCart.save();
      return res.status(201).json({ message: 'Success' });
    }

    userCart.products[productIndex].quantity -= 1;
    userCart.products[productIndex].totalPrice -= userCart.products[productIndex].price;

    await userCart.save();

    return res.status(201).json({ message: 'Success' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};

/**
  @type {import('express').RequestHandler}
*/
exports.removeFromCart = async (req, res, next) => {
  try {
    const { productId, color, size, dimension } = req.body;

    const userCart = await Cart.findOne({ user: req.user._id });

    const productIndex = userCart.products.findIndex(
      (e) => e.productId.toString() === productId && e.size === size && e.color === color && e.dimension === dimension
    );

    console.log(productIndex);
    userCart.products.splice(productIndex, 1);

    await userCart.save();

    return res.status(201).json({ message: 'Success' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};
