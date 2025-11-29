package com.kvgceosc;

import javax.mail.*;
import javax.mail.internet.*;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Properties;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.Scanner;

public class EmailSender {

    // Email configuration
    private static final String CONFIG_FILE = "config.properties";
    private static String SMTP_HOST;
    private static String SMTP_PORT;
    private static String SENDER_EMAIL;
    private static final String SENDER_PASSWORD = ""; // Will be provided at runtime
    
    public static void main(String[] args) {
        System.out.println("KVGCE OSC Email Sender");
        System.out.println("======================");
        
        // Load configuration
        loadConfiguration();
        
        // Get password from user
        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter your email password or App Password: ");
        String password = scanner.nextLine();
        
        // Get CSV file path
        System.out.print("Enter path to CSV file with recipient data (name,email): ");
        String csvFilePath = scanner.nextLine();
        
        // Send emails
        sendBulkEmails(password, csvFilePath);
        
        scanner.close();
    }
    
    private static void loadConfiguration() {
        try (FileInputStream fis = new FileInputStream(CONFIG_FILE)) {
            Properties props = new Properties();
            props.load(fis);
            
            SMTP_HOST = props.getProperty("smtp.host", "smtp.gmail.com");
            SMTP_PORT = props.getProperty("smtp.port", "587");
            SENDER_EMAIL = props.getProperty("sender.email", "hchc4010@gmail.com");
            
            // Ensure values are not null
            if (SMTP_HOST == null) SMTP_HOST = "smtp.gmail.com";
            if (SMTP_PORT == null) SMTP_PORT = "587";
            if (SENDER_EMAIL == null) SENDER_EMAIL = "hchc4010@gmail.com";
            
            System.out.println("Loaded configuration: host=" + SMTP_HOST + ", port=" + SMTP_PORT + ", email=" + SENDER_EMAIL);
        } catch (IOException e) {
            System.err.println("Warning: Could not load configuration file. Using defaults.");
            SMTP_HOST = "smtp.gmail.com";
            SMTP_PORT = "587";
            SENDER_EMAIL = "hchc4010@gmail.com";
            
            System.out.println("Using default configuration: host=" + SMTP_HOST + ", port=" + SMTP_PORT + ", email=" + SENDER_EMAIL);
        }
    }
    
    private static void sendBulkEmails(String password, String csvFilePath) {
        try (BufferedReader br = new BufferedReader(new FileReader(csvFilePath))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = br.readLine()) != null) {
                // Skip header line
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] data = line.split(",");
                if (data.length >= 2) {
                    String name = data[0].trim();
                    String email = data[1].trim();
                    
                    sendEmail(name, email, password);
                    System.out.println("Email sent to: " + name + " (" + email + ")");
                }
            }
            
            System.out.println("All emails sent successfully!");
        } catch (IOException e) {
            System.err.println("Error reading CSV file: " + e.getMessage());
            e.printStackTrace();
        } catch (Exception e) {
            System.err.println("Error sending emails: " + e.getMessage());
            e.printStackTrace();
        }
    }
    
    private static void sendEmail(String recipientName, String recipientEmail, String password) throws MessagingException {
        System.out.println("Sending email to: " + recipientName + " (" + recipientEmail + ")");
        
        // Set up mail server properties
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", SMTP_HOST);
        props.put("mail.smtp.port", SMTP_PORT);
        props.put("mail.smtp.ssl.protocols", "TLSv1.2");
        props.put("mail.smtp.ssl.trust", "*");

        // Create session with authentication
        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(SENDER_EMAIL, password);
            }
        });

        // Create message
        Message message = new MimeMessage(session);
        message.setFrom(new InternetAddress(SENDER_EMAIL));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientEmail));
        message.setSubject("Registration Confirmation - JAVA Programming for Beginner Workshop");

        // Personalize the email content
        String emailBody = getEmailTemplate(recipientName);
        message.setContent(emailBody, "text/html; charset=utf-8");

        // Send message
        Transport.send(message);
    }
    
    private static String getEmailTemplate(String name) {
        return "<!DOCTYPE html>" +
               "<html>" +
               "<head>" +
               "    <meta charset='UTF-8'>" +
               "    <title>Workshop Registration Confirmation</title>" +
               "</head>" +
               "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
               "    <div style='background-color: #f8f9fa; border-radius: 10px; padding: 20px; text-align: center;'>" +
               "        <h2 style='color: #2c3e50;'>Dear " + name + ",</h2>" +
               "        <p>Thank you for registering for the <strong>JAVA Programming for Beginner Workshop</strong> scheduled on <strong>1st December 2025</strong>.</p>" +
               "        <p>We are glad to inform you that your registration has been <span style='color: #27ae60; font-weight: bold;'>successfully confirmed</span>.</p>" +
               "    </div>" +
               "" +
               "    <div style='margin: 20px 0;'>" +
               "        <h3 style='color: #2980b9;'>Event Details:</h3>" +
               "        <ul style='list-style-type: none; padding: 0;'>" +
               "            <li style='padding: 5px 0;'><strong>📅 Date:</strong> 1st December 2025</li>" +
               "            <li style='padding: 5px 0;'><strong>⏰ Time:</strong> 2:00 PM</li>" +
               "            <li style='padding: 5px 0;'><strong>📍 Venue:</strong> Smart Classroom (406), KVGCE</li>" +
               "            <li style='padding: 5px 0;'><strong>🎯 Topic:</strong> JAVA Programming for Beginners</li>" +
               "            <li style='padding: 5px 0;'><strong>🪑 Seat Status:</strong> Confirmed (You are among the first 40 registrants)</li>" +
               "        </ul>" +
               "    </div>" +
               "" +
               "    <div style='background-color: #e8f4fc; border-left: 4px solid #3498db; padding: 15px; margin: 20px 0;'>" +
               "        <p>To receive updates, materials, and announcements,</p>" +
               "        <p><strong>👉 Please join the official WhatsApp group:</strong></p>" +
               "        <p style='text-align: center;'>" +
               "            <a href='https://chat.whatsapp.com/JtpVGeewqyuF417cZUqlrX?mode=hqrc' " +
               "               style='background-color: #25D366; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;'>" +
               "                Join WhatsApp Group" +
               "            </a>" +
               "        </p>" +
               "    </div>" +
               "" +
               "    <div style='margin: 20px 0;'>" +
               "        <p>Please arrive <strong>10 minutes early</strong> to ensure a smooth start.</p>" +
               "        <p>If you have any questions, feel free to reply to this email.</p>" +
               "        <p>Looking forward to seeing you at the workshop!</p>" +
               "    </div>" +
               "" +
               "    <div style='border-top: 1px solid #eee; padding-top: 15px; margin-top: 20px;'>" +
               "        <p style='margin: 5px 0;'><strong>Warm regards,</strong></p>" +
               "        <p style='margin: 5px 0;'><strong>KVGCE Open Source Community (OSC)</strong></p>" +
               "        <p style='margin: 5px 0;'>📧 <a href='mailto:kvgceoscsullia@gmail.com'>kvgceoscsullia@gmail.com</a></p>" +
               "        <p style='margin: 5px 0;'>🌐 <a href='http://www.kvgceosc.org'>www.kvgceosc.org</a></p>" +
               "    </div>" +
               "</body>" +
               "</html>";
    }
}