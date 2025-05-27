const Category = require('../models/Category');
const Product = require('../models/Product');

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await Category.findAll();
            res.json(categories);
        } catch (error) {
            console.error('Erreur lors de la récupération des catégories :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id, {
                include: [{ model: Product }]
            });
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
            res.json(category);
        } catch (error) {
            console.error('Erreur lors de la récupération de la catégorie :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    createCategory: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé : veuillez vous connecter' });
        }
        try {
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ message: 'Le nom de la catégorie est requis' });
            }
            const category = await Category.create({ name, description });
            res.status(201).json({
                message: 'Catégorie créée avec succès',
                category
            });
        } catch (error) {
            console.error('Erreur lors de la création de la catégorie :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    updateCategory: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé : veuillez vous connecter' });
        }
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
            await category.update({ name, description });
            res.json({
                message: 'Catégorie mise à jour avec succès',
                category
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la catégorie :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    deleteCategory: async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Non autorisé : veuillez vous connecter' });
        }
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ message: 'Catégorie non trouvée' });
            }
            await category.destroy();
            res.json({ message: 'Catégorie supprimée avec succès' });
        } catch (error) {
            console.error('Erreur lors de la suppression de la catégorie :', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }
};

module.exports = categoryController;
