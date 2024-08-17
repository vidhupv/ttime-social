// src/backend/server.js
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import PouchDB from 'pouchdb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, '../../')));

// Database setup
const db = new PouchDB('activities');

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is connected!' });
});

// Get all activities
app.get('/api/activities', async (req, res) => {
  try {
    const result = await db.allDocs({include_docs: true});
    const activities = result.rows.map(row => row.doc);
    res.json(activities);
  } catch (error) {
    console.error('Error retrieving activities:', error);
    res.status(500).json({error: 'Failed to retrieve activities'});
  }
});

// Create a new activity
app.post('/api/activities', async (req, res) => {
  try {
    const activity = req.body;
    const result = await db.post(activity);
    res.status(201).json({id: result.id, ...activity});
  } catch (error) {
    console.error('Error creating activity:', error);
    res.status(500).json({error: 'Failed to create activity'});
  }
});

// Update an activity
app.put('/api/activities/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const activity = req.body;
    const doc = await db.get(id);
    const result = await db.put({...doc, ...activity});
    res.json({id: result.id, ...activity});
  } catch (error) {
    console.error('Error updating activity:', error);
    res.status(500).json({error: 'Failed to update activity'});
  }
});

// Delete an activity
app.delete('/api/activities/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const doc = await db.get(id);
    await db.remove(doc);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting activity:', error);
    res.status(500).json({error: 'Failed to delete activity'});
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});