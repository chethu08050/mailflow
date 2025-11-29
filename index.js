const express = require('express');
const nodemailer = require('nodemailer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));

// Multer configuration for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Create public directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

// HTML form for uploading CSV and sending emails
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Email Sender</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .form-group { margin-bottom: 15px; }
            label { display: block; margin-bottom: 5px; }
            input, textarea { width: 100%; padding: 8px; }
            button { background-color: #4CAF50; color: white; padding: 10px 20px; border: none; cursor: pointer; }
            button:hover { background-color: #45a049; }
            .result { margin-top: 20px; padding: 10px; border-radius: 4px; }
            .success { background-color: #dff0d8; color: #3c763d; }
            .error { background-color: #f2dede; color: #a94442; }
        </style>
    </head>
    <body>
        <h1>Email Sender</h1>
        <form id="emailForm" enctype="multipart/form-data">
            <div class="form-group">
                <label for="gmailUser">Gmail Address:</label>
                <input type="email" id="gmailUser" name="gmailUser" required>
            </div>
            <div class="form-group">
                <label for="appPassword">App Password:</label>
                <input type="password" id="appPassword" name="appPassword" required>
            </div>
            <div class="form-group">
                <label for="csvFile">Upload CSV File (with name,email headers):</label>
                <input type="file" id="csvFile" name="csvFile" accept=".csv" required>
            </div>
            <button type="submit">Send Emails</button>
        </form>
        <div id="result"></div>
        
        <script>
            document.getElementById('emailForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const formData = new FormData();
                formData.append('gmailUser', document.getElementById('gmailUser').value);
                formData.append('appPassword', document.getElementById('appPassword').value);
                formData.append('csvFile', document.getElementById('csvFile').files[0]);
                
                const resultDiv = document.getElementById('result');
                resultDiv.innerHTML = '<p>Sending emails...</p>';
                
                try {
                    const response = await fetch('/send-emails', {
                        method: 'POST',
                        body: formData
                    });
                    
                    const result = await response.json();
                    
                    if (response.ok) {
                        resultDiv.innerHTML = '<div class="result success"><h3>Success!</h3><p>' + result.message + '</p><pre>' + JSON.stringify(result.details, null, 2) + '</pre></div>';
                    } else {
                        resultDiv.innerHTML = '<div class="result error"><h3>Error!</h3><p>' + result.error + '</p></div>';
                    }
                } catch (error) {
                    resultDiv.innerHTML = '<div class="result error"><h3>Error!</h3><p>' + error.message + '</p></div>';
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Endpoint to send emails
app.post('/send-emails', upload.single('csvFile'), async (req, res) => {
  try {
    const { gmailUser, appPassword } = req.body;
    const csvFilePath = req.file.path;
    
    // Validate inputs
    if (!gmailUser || !appPassword || !csvFilePath) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: appPassword
      }
    });
    
    // Verify transporter
    await transporter.verify();
    
    // Read CSV and send emails
    const results = [];
    const errors = [];
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let successCount = 0;
        let errorCount = 0;
        
        for (const row of results) {
          try {
            const mailOptions = {
              from: gmailUser,
              to: row.email,
              subject: 'Registration Confirmation - JAVA Programming for Beginner Workshop',
              html: getEmailTemplate(row.name)
            };
            
            await transporter.sendMail(mailOptions);
            successCount++;
            console.log(`Email sent to ${row.name} (${row.email})`);
          } catch (error) {
            errorCount++;
            errors.push({ name: row.name, email: row.email, error: error.message });
            console.error(`Failed to send email to ${row.name} (${row.email}):`, error.message);
          }
        }
        
        // Clean up uploaded file
        fs.unlinkSync(csvFilePath);
        
        res.json({
          message: `Email sending completed!`,
          details: {
            total: results.length,
            sent: successCount,
            failed: errorCount
          },
          errors: errors.length > 0 ? errors : undefined
        });
      });
  } catch (error) {
    console.error('Error:', error);
    // Ensure we always return JSON
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Email template function
function getEmailTemplate(name) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Workshop Registration Confirmation</title>
    </head>
    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>
        <div style='background-color: #f8f9fa; border-radius: 10px; padding: 20px; text-align: center;'>
            <h2 style='color: #2c3e50;'>Dear ${name},</h2>
            <p>Thank you for registering for the <strong>JAVA Programming for Beginner Workshop</strong> scheduled on <strong>1st December 2025</strong>.</p>
            <p>We are glad to inform you that your registration has been <span style='color: #27ae60; font-weight: bold;'>successfully confirmed</span>.</p>
        </div>

        <div style='margin: 20px 0;'>
            <h3 style='color: #2980b9;'>Event Details:</h3>
            <ul style='list-style-type: none; padding: 0;'>
                <li style='padding: 5px 0;'><strong>📅 Date:</strong> 1st December 2025</li>
                <li style='padding: 5px 0;'><strong>⏰ Time:</strong> 2:00 PM</li>
                <li style='padding: 5px 0;'><strong>📍 Venue:</strong> Smart Classroom (406), KVGCE</li>
                <li style='padding: 5px 0;'><strong>🎯 Topic:</strong> JAVA Programming for Beginners</li>
                <li style='padding: 5px 0;'><strong>🪑 Seat Status:</strong> Confirmed (You are among the first 40 registrants)</li>
            </ul>
        </div>

        <div style='background-color: #e8f4fc; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;'>
            <p>To receive updates, materials, and announcements,</p>
            <p><strong>👉 Please join the official WhatsApp group:</strong></p>
            <p style='text-align: center;'>
                <a href='https://chat.whatsapp.com/JtpVGeewqyuF417cZUqlrX?mode=hqrc' 
                   style='background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>
                    Join WhatsApp Group
                </a>
            </p>
        </div>

        <div style='margin: 20px 0;'>
            <p>Please arrive <strong>10 minutes early</strong> to ensure a smooth start.</p>
            <p>If you have any questions, feel free to reply to this email.</p>
            <p>Looking forward to seeing you at the workshop!</p>
        </div>

        <div style='border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;'>
            <p style='margin: 5px 0;'><strong>Warm regards,</strong></p>
            <p style='margin: 5px 0;'><strong>KVGCE Open Source Community (OSC)</strong></p>
            <p style='margin: 5px 0;'>📧 <a href='mailto:${process.env.GMAIL_USER || 'hchc4010@gmail.com'}'>${process.env.GMAIL_USER || 'hchc4010@gmail.com'}</a></p>
            <p style='margin: 5px 0;'>🌐 <a href='http://www.kvgceosc.org'>www.kvgceosc.org</a></p>
        </div>
    </body>
    </html>
  `;
}

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Import the API handler
const sendEmailsHandler = require('./api/send-emails');

// API route for local development
app.post('/api/send-emails', sendEmailsHandler);

// Export for Vercel
module.exports = app;

// Start server if not running on Vercel
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Email sender app listening at http://localhost:${port}`);
    console.log(`API endpoint available at http://localhost:${port}/api/send-emails`);
  });
}