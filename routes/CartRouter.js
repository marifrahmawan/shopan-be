const router = require('express').Router();
const CartController = require('../controllers/CartController');
const { verifyTokenAndAuth } = require('../middlewares/verifyUser');

router.get('/', verifyTokenAndAuth, CartController.getUserCart);
router.post('/', verifyTokenAndAuth, CartController.addToCart);
router.post('/reduce', verifyTokenAndAuth, CartController.reduceFromCart);
router.post('/remove', verifyTokenAndAuth, CartController.removeFromCart);

module.exports = router;
