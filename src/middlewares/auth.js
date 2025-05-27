const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Token manquant ou mal formaté' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ message: 'Token invalide ou expiré' });
        }
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Utilisateur non trouvé' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Erreur d\'authentification :', error);
        res.status(401).json({ message: 'Échec de l\'authentification' });
    }
};

module.exports = auth;
