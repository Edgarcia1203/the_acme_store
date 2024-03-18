const { Client } = require('pg');
const bcrypt = require('bcrypt');


const client = new Client();


client.connect();


async function createTables() {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY,
        name VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_user_product UNIQUE (user_id, product_id)
      );
    `);
    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
}


async function fetchUsers() {
  try {
    const result = await client.query('SELECT * FROM users');
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}


async function fetchProducts() {
  try {
    const result = await client.query('SELECT * FROM products');
    return result.rows;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}


async function fetchFavorites(userId) {
  try {
    const result = await client.query('SELECT * FROM favorites WHERE user_id = $1', [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}


async function createFavorite(userId, productId) {
  try {
    const result = await client.query('INSERT INTO favorites (id, product_id, user_id) VALUES (uuid_generate_v4(), $1, $2) RETURNING *', [productId, userId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error creating favorite:', error);
    throw error;
  }
}


async function destroyFavorite(userId, favoriteId) {
  try {
    await client.query('DELETE FROM favorites WHERE id = $1 AND user_id = $2', [favoriteId, userId]);
  } catch (error) {
    console.error('Error deleting favorite:', error);
    throw error;
  }
}

module.exports = {
  createTables,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  destroyFavorite
}