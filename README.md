# TP2 – API REST Node.js / Express

## 🚀 Lancement du serveur

Avant de lancer le serveur, créez un fichier `.env` à la racine du projet avec les variables d'environnement suivantes :

```env
DB_NAME=simple_database
DB_USER=          # Votre nom d'utilisateur de la base de données
DB_PASSWORD=      # Votre mot de passe de la base de données
DB_HOST=localhost
PORT=5000

JWT_SECRET=       # Une clé secrète JWT (générée avec par exemple `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
JWT_EXPIRES_IN=1h # Durée de validité du token JWT
```

Depuis la racine du projet, exécutez :

```bash
node server.js
```

Assurez-vous d’avoir installé les dépendances avec :

```bash
npm install
```

Aussi pour vous assurer de bien vous connecter à la base de données, créez un utilisateur et donnez lui tous les droits sur la base de données `simple_database` :

```bash
mysql -u root -p
CREATE USER 'simple_user'@'localhost' IDENTIFIED BY 'simple_password';
GRANT ALL PRIVILEGES ON simple_database.* TO 'simple_user'@'localhost';
FLUSH PRIVILEGES;
```

## 📚 Endpoints de l’API

---

### 🔐 Authentification

| Méthode | Endpoint    | Description                                     |
| ------- | ----------- | ----------------------------------------------- |
| POST    | `/register` | Enregistre un nouvel utilisateur                |
| POST    | `/login`    | Connecte un utilisateur et renvoie un token JWT |

> ⚠️ Pour les routes protégées (`POST`, `PUT`, `DELETE` sur produits et catégories), incluez un en-tête :
>
> `Authorization: Bearer <token>`

---

### 👒 Produits

| Méthode | Endpoint        | Description                    |
| ------- | --------------- | ------------------------------ |
| GET     | `/products`     | Liste tous les produits        |
| GET     | `/products/:id` | Détail d’un produit par ID     |
| POST    | `/products`     | Crée un nouveau produit 🔒     |
| PUT     | `/products/:id` | Modifie un produit existant 🔒 |
| DELETE  | `/products/:id` | Supprime un produit 🔒         |

---

### 📂 Catégories

| Méthode | Endpoint          | Description                        |
| ------- | ----------------- | ---------------------------------- |
| GET     | `/categories`     | Liste toutes les catégories        |
| GET     | `/categories/:id` | Détail d’une catégorie par ID      |
| POST    | `/categories`     | Crée une nouvelle catégorie 🔒     |
| PUT     | `/categories/:id` | Modifie une catégorie existante 🔒 |
| DELETE  | `/categories/:id` | Supprime une catégorie 🔒          |

---

## 🔧 Exemples de requêtes

### Authentification

```http
POST /login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "123456"
}
```

Réponse :

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Créer un produit (authentifié)

```http
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Clavier",
  "price": 49.99,
  "description": "Clavier mécanique RGB",
  "stock": 10,
  "categoryId": 2
}
```

---

## 🛡 Sécurité & Cache

* Les routes protégées nécessitent un token JWT valide.
* Les routes `GET` peuvent être mises en cache côté client pendant 5 minutes (`Cache-Control: public, max-age=300`).

---

## 📋 Technologies

* Node.js
* Express
* Sequelize (ORM)
* JWT (authentification)

---

## 🧪 Tests

Vous pouvez tester les routes avec [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/).

---

## 📁 Structure des dossiers

```
/controllers      → logique métier
/models           → définitions Sequelize
/routes           → routes Express
/middlewares      → vérifications JWT, cache, etc.
```
