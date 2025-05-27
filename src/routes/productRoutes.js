const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middlewares/auth');

router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', auth, productController.createProduct);
router.put('/products/:id', auth, productController.updateProduct);
router.delete('/products/:id', auth, productController.deleteProduct);

router.all('/products', (req, res, next) => {
    if (!['GET', 'POST'].includes(req.method)) {
        return res.status(405).json({ message: 'Méthode non autorisée pour /products' });
    }
    next();
});

router.all('/products/:id', (req, res, next) => {
    if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
        return res.status(405).json({ message: 'Méthode non autorisée pour /products/:id' });
    }
    next();
});

module.exports = router;
