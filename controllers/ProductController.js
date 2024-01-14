const Product = require('../models/ProductModel');

const handleUpload = require('../utils/upload-files');

/** @type {import("express").RequestHandler} */
exports.getProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 0;

    const products = await Product.find().limit(limit);

    return res.status(200).json({ message: 'Success', data: products });
  } catch (error) {
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};

/** @type {import("express").RequestHandler} */
exports.getProductsById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Not Found' });
    }

    return res.status(200).json({ message: 'Success', data: product });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

/** @type {import("express").RequestHandler} */
exports.createProduct = async (req, res, next) => {
  try {
    const productImageUrl = await Promise.all(
      req.files.map(async (file) => {
        try {
          const b64 = Buffer.from(file.buffer).toString('base64');
          let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
          const cldRes = await handleUpload(dataURI);

          return cldRes.secure_url;
        } catch (error) {
          throw error;
        }
      })
    );

    const {
      productName,
      productDetail,
      productCategory,
      productPrice,
      productBrand,
      productAvailable,
      productStock,
      productSize,
      productColor,
      productDimension,
    } = req.body;

    const newProduct = new Product({
      productName,
      productDetail,
      productCategory,
      productPrice,
      productBrand,
      productAvailable,
      productStock,
      productPicture: productImageUrl,
      productSize,
      productColor,
      productDimension,
    });

    const successAddProduct = await newProduct.save();

    return res.status(201).json({ message: 'Success Add Product', data: successAddProduct });
  } catch (error) {
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};

/** @type {import("express").RequestHandler} */
exports.updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (req.files.length > 0) {
      const productImageUrl = await Promise.all(
        req.files.map(async (file) => {
          try {
            const b64 = Buffer.from(file.buffer).toString('base64');
            let dataURI = 'data:' + file.mimetype + ';base64,' + b64;
            const cldRes = await handleUpload(dataURI);

            return cldRes.secure_url;
          } catch (error) {
            throw error;
          }
        })
      );

      const updateProduct = await Product.findByIdAndUpdate(
        productId,
        {
          $set: {
            ...req.body,
            productPicture: productImageUrl,
            productColor: req.body.productColor === undefined ? [] : req.body.productColor,
            productSize: req.body.productSize === undefined ? [] : req.body.productSize,
            productDimension: req.body.productDimension === undefined ? [] : req.body.productDimension,
          },
        },
        {
          new: true,
        }
      );

      return res.status(201).json({ message: 'Success', data: updateProduct });
    }

    const updateProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $set: {
          ...req.body,
          productColor: req.body.productColor === undefined ? [] : req.body.productColor,
          productSize: req.body.productSize === undefined ? [] : req.body.productSize,
          productDimension: req.body.productDimension === undefined ? [] : req.body.productDimension,
        },
      },
      {
        new: true,
      }
    );

    return res.status(201).json({ message: 'Success', data: updateProduct });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};

/** @type {import("express").RequestHandler} */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    await Product.findByIdAndDelete(productId);

    return res.status(200).json({ message: 'Success' });
  } catch (error) {
    return res.status(500).json({ message: 'Something went Wrong. Try Again Later', error: error });
  }
};
