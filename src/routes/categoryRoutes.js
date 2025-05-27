const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');

router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', auth, categoryController.createCategory);
router.put('/categories/:id', auth, categoryController.updateCategory);
router.delete('/categories/:id', auth, categoryController.deleteCategory);

router.all('/categories', (req, res, next) => {
    if (!['GET', 'POST'].includes(req.method)) {
        return res.status(405).json({ message: 'Méthode non autorisée sur /categories' });
    }
    next();
});

router.all('/categories/:id', (req, res, next) => {
    if (!['GET', 'PUT', 'DELETE'].includes(req.method)) {
        return res.status(405).json({ message: 'Méthode non autorisée sur /categories/:id' });
    }
    next();
});

module.exports = router;