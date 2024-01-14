const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController');
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

router.get('/', CategoryController.getCategory);
router.post('/', verifyTokenAndAdmin, upload.single('categoryImage'), CategoryController.addCategory);
router.put(
  '/update/:categoryId',
  verifyTokenAndAdmin,
  upload.single('categoryImage'),
  CategoryController.updateCategory
);
router.delete('/delete/:categoryId', verifyTokenAndAdmin, CategoryController.deleteCategory);

module.exports = router;
