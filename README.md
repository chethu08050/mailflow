# KVGCE OSC Email Sender

A Java application for sending bulk personalized confirmation emails for the JAVA Programming for Beginner Workshop.

## Prerequisites

1. Java 11 or higher
2. Maven
3. Gmail account with App Password (for sending emails)

## Setup Instructions

1. **Configure Gmail Account:**
   - Enable 2-Factor Authentication on your Gmail account
   - Generate an App Password:
     - Go to Google Account settings
     - Security → 2-Step Verification → App passwords
     - Generate a new app password for "Mail"
     - Save this password for use in the application

2. **Prepare Recipient Data:**
   - Create a CSV file with recipient names and emails
   - First row should be headers: `name,email`
   - Example format:
     ```
     name,email
     John Doe,johndoe@example.com
     Jane Smith,janesmith@example.com
     ```

3. **Build the Application:**
   ```bash
   mvn clean package
   ```

4. **Run the Application:**
   ```bash
   java -jar target/email-sender-1.0-SNAPSHOT.jar
   ```

5. **Provide Inputs When Prompted:**
   - Enter your Gmail App Password
   - Enter the path to your CSV file

## Features

- Sends personalized HTML emails to multiple recipients
- Uses Gmail SMTP for reliable delivery
- Securely handles credentials (password is entered at runtime)
- Provides confirmation for each sent email

## Customization

To customize the email template:
1. Edit the `getEmailTemplate()` method in [EmailSender.java](src/main/java/com/kvgceosc/EmailSender.java)
2. Rebuild the application with `mvn clean package`

## Troubleshooting

- **Authentication Issues:** Ensure you're using an App Password, not your regular Gmail password
- **SMTP Errors:** Check your internet connection and firewall settings
- **CSV Format Issues:** Ensure your CSV file follows the exact format specified above