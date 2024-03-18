const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { createTables, createProduct, createUser, fetchUsers, fetchProducts, fetchFavorites, createFavorite, destroyFavorite } = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());


createTables();


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});


app.get('/api/users', async (req, res) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});


app.get('/api/products', async (req, res) => {
  try {
    const products = await fetchProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


app.get('/api/users/:id/favorites', async (req, res) => {
  const userId = req.params.id;
  try {
    const favorites = await fetchFavorites(userId);
    res.json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});


app.post('/api/users/:id/favorites', async (req, res) => {
  const userId = req.params.id;
  const productId = req.body.product_id;
  try {
    const favorite = await createFavorite(userId, productId);
    res.status(201).json(favorite);
  } catch (error) {
    console.error('Error creating favorite:', error);
    res.status(500).json({ error: 'Failed to create favorite' });
  }
});


app.delete('/api/users/:userId/favorites/:id', async (req, res) => {
  const userId = req.params.userId;
  const favoriteId = req.params.id;
  try {
    await destroyFavorite(userId, favoriteId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({ error: 'Failed to delete favorite' });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});