import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Data storage (temporary, replace with database later)
let activities = [];

// Routes
// CREATE - Add a new activity
app.post('/api/activities', async (req, res) => {
    try {
        const newActivity = {
            id: activities.length + 1,
            userId: req.body.userId,
            type: req.body.type,
            content: req.body.content,
            timestamp: new Date().toISOString()
        };
        activities.push(newActivity);
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create activity' });
    }
});

// READ - Get all activities
app.get('/api/activities', async (req, res) => {
    try {
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activities' });
    }
});

// READ - Get a specific activity by ID
app.get('/api/activities/:id', async (req, res) => {
    try {
        const activity = activities.find(a => a.id === parseInt(req.params.id));
        if (activity) {
            res.status(200).json(activity);
        } else {
            res.status(404).json({ error: 'Activity not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

// DELETE - Remove an activity
app.delete('/api/activities/:id', async (req, res) => {
  try {
      const id = parseInt(req.params.id);
      const index = activities.findIndex(a => a.id === id);
      if (index !== -1) {
          activities.splice(index, 1);
          res.status(200).json({ message: 'Activity deleted successfully' });
      } else {
          res.status(404).json({ error: 'Activity not found' });
      }
  } catch (error) {
      console.error('Error deleting activity:', error);
      res.status(500).json({ error: 'Failed to delete activity' });
  }
});
// Serve the frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});