const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// In-memory data store
let courses = [
  { 
    id: 1, 
    title: 'Introduction to DevOps', 
    instructor: 'John Doe', 
    students: 150, 
    duration: '8 weeks',
    description: 'Learn DevOps fundamentals and best practices',
    price: 99.99
  },
  { 
    id: 2, 
    title: 'Docker Fundamentals', 
    instructor: 'Jane Smith', 
    students: 200, 
    duration: '6 weeks',
    description: 'Master container technology with Docker',
    price: 79.99
  },
  { 
    id: 3, 
    title: 'CI/CD with GitHub Actions', 
    instructor: 'Bob Johnson', 
    students: 175, 
    duration: '4 weeks',
    description: 'Automate your deployment pipeline',
    price: 89.99
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

app.get('/api/courses', (req, res) => {
  res.json({ 
    success: true, 
    data: courses, 
    count: courses.length 
  });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  res.json({ success: true, data: course });
});

app.post('/api/courses', (req, res) => {
  const { title, instructor, duration, description, price } = req.body;
  
  if (!title || !instructor) {
    return res.status(400).json({ 
      success: false, 
      error: 'Title and instructor are required' 
    });
  }

  const newCourse = {
    id: courses.length + 1,
    title,
    instructor,
    students: 0,
    duration: duration || 'TBD',
    description: description || '',
    price: price || 0
  };
  
  courses.push(newCourse);
  res.status(201).json({ success: true, data: newCourse });
});

app.delete('/api/courses/:id', (req, res) => {
  const index = courses.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Course not found' });
  }
  courses.splice(index, 1);
  res.json({ success: true, message: 'Course deleted' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  server.close(() => console.log('Server closed'));
});

module.exports = { app, server };
