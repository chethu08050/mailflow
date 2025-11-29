const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { gmailUser, appPassword, csvData } = req.body;
    
    // Validate inputs
    if (!gmailUser || !appPassword || !csvData) {
      return res.status(400).json({ error: 'Missing required fields: gmailUser, appPassword, or csvData' });
    }
    
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: appPassword
      }
    });
    
    // Parse CSV data
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');
    const emailIndex = headers.indexOf('email');
    const nameIndex = headers.indexOf('name');
    
    if (emailIndex === -1 || nameIndex === -1) {
      return res.status(400).json({ error: 'CSV must contain name and email columns' });
    }
    
    // Process each row
    const results = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      if (values.length >= Math.max(emailIndex, nameIndex) + 1) {
        results.push({
          name: values[nameIndex].trim(),
          email: values[emailIndex].trim()
        });
      }
    }
    
    // Send emails
    const successes = [];
    const failures = [];
    
    for (const recipient of results) {
      try {
        const mailOptions = {
          from: gmailUser,
          to: recipient.email,
          subject: 'Registration Confirmation - JAVA Programming for Beginner Workshop',
          html: getEmailTemplate(recipient.name)
        };
        
        await transporter.sendMail(mailOptions);
        successes.push(recipient);
        console.log(`Email sent to ${recipient.name} (${recipient.email})`);
      } catch (error) {
        failures.push({ ...recipient, error: error.message });
        console.error(`Failed to send email to ${recipient.name} (${recipient.email}):`, error.message);
      }
    }
    
    res.status(200).json({
      message: `Email sending completed!`,
      details: {
        total: results.length,
        sent: successes.length,
        failed: failures.length
      },
      failures: failures.length > 0 ? failures : undefined
    });
  } catch (error) {
    console.error('Error:', error);
    // Ensure we always return JSON
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

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