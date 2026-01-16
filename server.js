const express = require('express');
const { Pool } = require('pg');
require('dotenv').config();
const path = require('path');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.static('public')); // Sirve tu HTML, CSS y JS

// Configuración de la base de datos (PostgreSQL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Requerido para Render
  }
});

// Crear la tabla automáticamente si no existe al arrancar
const crearTabla = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tareas (
      id SERIAL PRIMARY KEY,
      titulo TEXT NOT NULL
    )
  `);
};
crearTabla();

// --- RUTAS DEL CRUD ---

// 1. LEER (Read)
app.get('/tareas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tareas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. CREAR (Create)
app.post('/tareas', async (req, res) => {
  try {
    const { titulo } = req.body;
    const result = await pool.query(
      'INSERT INTO tareas (titulo) VALUES ($1) RETURNING *',
      [titulo]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. ACTUALIZAR (Update)
app.put('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo } = req.body;
    await pool.query('UPDATE tareas SET titulo = $1 WHERE id = $2', [titulo, id]);
    res.send("Tarea actualizada");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. ELIMINAR (Delete)
app.delete('/tareas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM tareas WHERE id = $1', [id]);
    res.send("Tarea eliminada");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});