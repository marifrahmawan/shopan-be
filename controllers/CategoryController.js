const CategoryModel = require('../models/CategoryModel');
const handleUpload = require('../utils/upload-files');

/** @type {import('express').RequestHandler} */
exports.getCategory = async (req, res, next) => {
  try {
    const category = await CategoryModel.find();

    return res.status(200).json({
      message: 'Success',
      data: category.sort((a, b) => (a.categoryName.toUpperCase() < b.categoryName.toUpperCase() ? -1 : 1)),
    });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};

/** @type {import('express').RequestHandler} */
exports.addCategory = async (req, res, next) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
    const cldRes = await handleUpload(dataURI);

    const { categoryName } = req.body;
    const newCategory = new CategoryModel({
      categoryName,
      categoryImage: cldRes.secure_url,
    });

    await newCategory.save();

    return res.status(201).json({ message: 'Success', data: newCategory });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};

/** @type {import('express').RequestHandler} */
exports.updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      let dataURI = 'data:' + req.file.mimetype + ';base64,' + b64;
      const cldRes = await handleUpload(dataURI);

      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        categoryId,
        {
          $set: {
            categoryName: req.body.categoryName,
            categoryImage: cldRes.secure_url,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({ message: 'Success', data: updatedCategory });
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      categoryId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({ message: 'Success', data: updatedCategory });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};

/** @type {import('express').RequestHandler} */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await CategoryModel.findByIdAndDelete(categoryId);

    return res.status(200).json({ message: 'Success', data: deletedCategory });
  } catch (error) {
    return res.status(500).json({ message: 'Something went wrong', error });
  }
};
