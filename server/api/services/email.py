import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv

load_dotenv()

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)
APP_NAME = os.getenv("APP_NAME", "Hire Radar")


def send_email(to_email, subject, html_content):
    """
    Send an email using SMTP.
    """
    try:
        # Create message
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = FROM_EMAIL
        message["To"] = to_email

        # Add HTML content
        html_part = MIMEText(html_content, "html")
        message.attach(html_part)

        # Send email
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(FROM_EMAIL, to_email, message.as_string())

        print(f"Email sent successfully to {to_email}")
        return True

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return False


def send_reset_email(to_email, user_name, reset_url):
    """
    Send password reset email with styled HTML template.
    """
    subject = f"Reset Your {APP_NAME} Password"
    
    html_content = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: white; padding: 20px;">
            <tr>
                <td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <!-- Header -->
                        <tr>
                            <td style="background-color: black; padding: 30px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">{APP_NAME}</h1>
                            </td>
                        </tr>
                        
                        <!-- Content -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">
                                    Reset Your Password
                                </h2>
                                
                                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    Hi {user_name},
                                </p>
                                
                                <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                                    We received a request to reset your password. Click the button below to create a new password:
                                </p>
                                
                                <!-- Button -->
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                    <tr>
                                        <td align="center">
                                            <a href="{reset_url}" 
                                               style="display: inline-block; padding: 14px 40px; background-color: black; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold;">
                                                Reset Password
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                
                                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    Or copy and paste this link into your browser:
                                </p>
                                <p style="color: #4F46E5; font-size: 14px; word-break: break-all; margin: 10px 0 20px 0;">
                                    {reset_url}
                                </p>
                                
                                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    This link will expire in 1 hour for security reasons.
                                </p>
                                
                                <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                                    If you didn't request this password reset, please ignore this email or contact support if you have concerns.
                                </p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td style="background-color: #f9f9f9; padding: 20px 30px; text-align: center; border-top: 1px solid #eeeeee;">
                                <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.6;">
                                    © 2024 {APP_NAME}. All rights reserved.
                                </p>
                                <p style="color: #999999; font-size: 12px; margin: 10px 0 0 0;">
                                    This is an automated email, please do not reply.
                                </p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """
    
    return send_email(to_email, subject, html_content)