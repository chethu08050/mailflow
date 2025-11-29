// Vercel entry point for the main application
const express = require('express');
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Health check endpoint
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Email Sender</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .info { background-color: #e8f4fc; padding: 15px; border-radius: 4px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1>Email Sender API</h1>
        <div class="info">
            <p>This is the Email Sender API service deployed on Vercel.</p>
            <p>To send emails, use the <code>/api/send-emails</code> endpoint with a POST request.</p>
            <p>For a web interface, visit the local version of this application.</p>
        </div>
        <h2>API Usage</h2>
        <p><strong>Endpoint:</strong> <code>POST /api/send-emails</code></p>
        <p><strong>Headers:</strong> <code>Content-Type: application/json</code></p>
        <p><strong>Body:</strong></p>
        <pre>{
  "gmailUser": "your-email@gmail.com",
  "appPassword": "your-app-password",
  "csvData": "name,email\\nJohn Doe,john@example.com\\nJane Smith,jane@example.com"
}</pre>
    </body>
    </html>
  `);
});

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

module.exports = app;