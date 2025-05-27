const Product = require('../models/Product');
const Category = require('../models/Category');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.findAll({
                include: [{ model: Category }]
            });
            res.json(products);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    getProductById: async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id, {
                include: [{ model: Category }]
            });
            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            res.json(product);
        } catch (error) {
            console.error('Erreur lors de la récupération du produit :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    createProduct: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé : veuillez vous connecter' });
        }
        try {
            const { name, description, price, stock, categoryId } = req.body;
            if (!name || !price || !categoryId) {
                return res.status(400).json({ message: 'Nom, prix et catégorie sont requis' });
            }
            const category = await Category.findByPk(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
            const product = await Product.create({
                name,
                description,
                price,
                stock,
                categoryId
            });
            res.status(201).json({
                message: 'Produit créé avec succès',
                product
            });
        } catch (error) {
            console.error('Erreur lors de la création du produit :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    updateProduct: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé : veuillez vous connecter' });
        }
        try {
            const { id } = req.params;
            const { name, description, price, stock, categoryId } = req.body;
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            if (categoryId) {
                const category = await Category.findByPk(categoryId);
                if (!category) {
                    return res.status(404).json({ message: 'Catégorie non trouvée' });
                }
            }
            await product.update({
                name,
                description,
                price,
                stock,
                categoryId
            });
            res.json({
                message: 'Produit mis à jour avec succès',
                product
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du produit :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    deleteProduct: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé : veuillez vous connecter' });
        }
        try {
            const { id } = req.params;
            const product = await Product.findByPk(id);
            if (!product) {
                return res.status(404).json({ message: 'Produit non trouvé' });
            }
            await product.destroy();
            res.json({ message: 'Produit supprimé avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression du produit :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }
};

module.exports = productController;
