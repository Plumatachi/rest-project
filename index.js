const API_BASE = 'http://localhost:5000/api';
let token = null;
let products = [];
let categories = [];

function showMessage(message, type = 'success') {
    const messagesDiv = document.getElementById('messages');
    messagesDiv.innerHTML = `<div class="${type}">${message}</div>`;
    setTimeout(() => {
        messagesDiv.innerHTML = '';
    }, 5000);
}

function updateAuthStatus() {
    const status = document.getElementById('authStatus');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loggedIn = document.getElementById('loggedInSection');
    const showAddBtn = document.getElementById('showAddBtn');
    if (token) {
        status.textContent = 'Connecté';
        status.className = 'status connected';
        loginForm.classList.add('hidden');
        registerForm.classList.add('hidden');
        loggedIn.classList.remove('hidden');
        showAddBtn.classList.remove('hidden');
    } else {
        status.textContent = 'Non connecté';
        status.className = 'status disconnected';
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loggedIn.classList.add('hidden');
        showAddBtn.classList.add('hidden');
    }
}

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

function showLoginForm() {
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
}

async function register() {
    const login = document.getElementById('registerLogin').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    if (!login || !password) {
        showMessage('Login et mot de passe sont obligatoires', 'error');
        return;
    }
    if (password !== confirmPassword) {
        showMessage('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    if (password.length < 6) {
        showMessage('Le mot de passe doit faire au moins 6 caractères', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: login, password })
        });
        if (response.ok) {
            showMessage('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
            document.getElementById('registerLogin').value = '';
            document.getElementById('registerPassword').value = '';
            document.getElementById('registerConfirmPassword').value = '';
            showLoginForm();
        } else if (response.status === 409) {
            showMessage('Ce login existe déjà', 'error');
        } else {
            showMessage('Erreur lors de la création du compte', 'error');
        }
    } catch (error) {
        showMessage('Erreur de connexion au serveur', 'error');
    }
}

async function login() {
    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;
    if (!login || !password) {
        showMessage('Veuillez remplir tous les champs', 'error');
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: login, password })
        });
        if (response.ok) {
            const data = await response.json();
            token = data.token;
            updateAuthStatus();
            showMessage('Connexion réussie !');
            document.getElementById('loginInput').value = '';
            document.getElementById('passwordInput').value = '';
            loadProducts();
            loadCategories();
        } else {
            showMessage('Identifiants incorrects', 'error');
        }
    } catch (error) {
        showMessage('Erreur de connexion au serveur', 'error');
    }
}

function logout() {
    token = null;
    updateAuthStatus();
    showMessage('Déconnexion réussie');
    document.getElementById('productsContainer').innerHTML = '';
    hideAllForms();
}

async function apiCall(endpoint, options = {}) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };
    if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, config);
        if (response.status === 401) {
            showMessage('Session expirée, veuillez vous reconnecter', 'error');
            logout();
            return null;
        }
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        showMessage(`Erreur: ${error.message}`, 'error');
        return null;
    }
}

async function loadProducts() {
    const data = await apiCall(`/products?t=${Date.now()}`);
    if (data) {
        products = data;
        displayProducts();
    }
}

async function loadCategories() {
    const data = await apiCall('/categories');
    if (data) {
        categories = data;
        updateCategorySelects();
    }
}

function updateCategorySelects() {
    const selects = ['productCategory', 'editProductCategory'];
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        select.innerHTML = '<option value="">Sélectionner une catégorie</option>';
        categories.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
    });
}

function displayProducts() {
    const container = document.getElementById('productsContainer');
    if (products.length === 0) {
        container.innerHTML = '<p>Aucun produit trouvé.</p>';
        return;
    }
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <h3>${product.name}</h3>
            <p><strong>Prix:</strong> ${product.price}€</p>
            <p><strong>Description:</strong> ${product.description || 'Aucune description'}</p>
            <p><strong>Catégorie:</strong> ${product.Category ? product.Category.name : 'Aucune'}</p>
            <div class="product-actions">
                <button onclick="editProduct(${product.id})" ${!token ? 'disabled' : ''}>Modifier</button>
                <button onclick="deleteProduct(${product.id})" class="danger" ${!token ? 'disabled' : ''}>Supprimer</button>
            </div>
        </div>
    `).join('');
}

function showAddForm() {
    hideAllForms();
    document.getElementById('addProductForm').classList.remove('hidden');
}

function hideAllForms() {
    document.getElementById('addProductForm').classList.add('hidden');
    document.getElementById('editProductForm').classList.add('hidden');
}

function cancelAdd() {
    hideAllForms();
    clearAddForm();
}

function cancelEdit() {
    hideAllForms();
}

function clearAddForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productCategory').value = '';
}

async function addProduct() {
    const name = document.getElementById('productName').value;
    const price = document.getElementById('productPrice').value;
    const description = document.getElementById('productDescription').value;
    const categoryId = document.getElementById('productCategory').value;
    if (!name || !price) {
        showMessage('Nom et prix sont obligatoires', 'error');
        return;
    }
    const productData = {
        name,
        price: parseFloat(price),
        description,
        categoryId: categoryId || null
    };
    const result = await apiCall('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
    });
    if (result) {
        showMessage('Produit ajouté avec succès !');
        clearAddForm();
        hideAllForms();
        loadProducts();
    }
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    hideAllForms();
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductDescription').value = product.description || '';
    document.getElementById('editProductCategory').value = product.categoryId || '';
    document.getElementById('editProductForm').classList.remove('hidden');
}

async function updateProduct() {
    const id = document.getElementById('editProductId').value;
    const name = document.getElementById('editProductName').value;
    const price = document.getElementById('editProductPrice').value;
    const description = document.getElementById('editProductDescription').value;
    const categoryId = document.getElementById('editProductCategory').value;
    if (!name || !price) {
        showMessage('Nom et prix sont obligatoires', 'error');
        return;
    }
    const productData = {
        name,
        price: parseFloat(price),
        description,
        categoryId: categoryId || null
    };
    const result = await apiCall(`/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
    });
    if (result) {
        showMessage('Produit modifié avec succès !');
        hideAllForms();
        loadProducts();
    }
}

async function deleteProduct(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        return;
    }
    const result = await apiCall(`/products/${id}`, {
        method: 'DELETE'
    });
    if (result) {
        showMessage('Produit supprimé avec succès !');
        loadProducts();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    updateAuthStatus();
    loadProducts();
    loadCategories();
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
    document.getElementById('registerConfirmPassword').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            register();
        }
    });
});