const router = require('express').Router();
const ProductController = require('../controllers/ProductController');
const { verifyTokenAndAdmin } = require('../middlewares/verifyUser');

const Multer = require('multer');
const storage = new Multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = Multer({
  storage,
  fileFilter,
});

router.get('/', ProductController.getProducts);
router.get('/:productId', ProductController.getProductsById);
router.post(
  '/create',
  verifyTokenAndAdmin,
  upload.any(),
  ProductController.createProduct
);
router.put(
  '/update/:productId',
  verifyTokenAndAdmin,
  upload.any(),
  ProductController.updateProduct
);
router.delete('/delete/:productId', verifyTokenAndAdmin, ProductController.deleteProduct);

module.exports = router;
