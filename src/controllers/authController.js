const User = require('../models/User');
const { generateToken } = require('../config/jwt');

const authController = {
    register: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
            }
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(400).json({ message: 'Cet utilisateur existe déjà' });
            }
            const user = await User.create({ username, password });
            const token = generateToken(user.id);
            res.status(201).json({
                message: 'Utilisateur créé avec succès',
                token
            });
        } catch (error) {
            console.error('Erreur lors de l\'inscription : ', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ message: 'Nom d\'utilisateur et mot de passe requis' });
            }
            const user = await User.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({ message: 'Identifiants invalides' });
            }
            const isMatch = await user.verifyPassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Identifiants invalides' });
            }
            const token = generateToken(user.id);
            res.json({
                message: 'Connexion réussie',
                token
            });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }
};

module.exports = authController;