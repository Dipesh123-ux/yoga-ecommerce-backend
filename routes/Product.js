const express =  require('express');

const router =  express.Router();

const {addProduct,photo,getAllProducts,deleteProduct} = require('../controllers/Product')

router.post('/create',addProduct);
router.get('/photo/:id',photo)
router.get('/products',getAllProducts);
router.delete('/product/:id',deleteProduct);

module.exports = router;