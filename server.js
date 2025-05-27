require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const cacheControl = require('./src/middlewares/cacheControl');

const app = express();

app.use(cors());
app.use(express.json());

app.use(cacheControl);

app.use('/api', authRoutes);
app.use('/api', productRoutes);
app.use('/api', categoryRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route non trouvée' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur' });
});

const PORT = process.env.PORT;

sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Serveur démarré sur le port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erreur de connexion à la base de données:', err);
    });