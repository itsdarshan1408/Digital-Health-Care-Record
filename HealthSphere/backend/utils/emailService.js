import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email credentials not configured');
    return null;
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send reminder email
export const sendReminderEmail = async (to, userName, title, description) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      console.log('Email service not configured, skipping email');
      return;
    }

    const mailOptions = {
      from: `"HealthSphere" <${process.env.EMAIL_USER}>`,
      to,
      subject: `🔔 Reminder: ${title}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .reminder-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; border-radius: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 HealthSphere Reminder</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>This is a friendly reminder from HealthSphere:</p>
              
              <div class="reminder-box">
                <h2 style="margin-top: 0; color: #667eea;">📋 ${title}</h2>
                ${description ? `<p>${description}</p>` : ''}
              </div>
              
              <p>Stay on track with your health goals! 💪</p>
              
              <p>Best regards,<br>The HealthSphere Team</p>
            </div>
            <div class="footer">
              <p>This is an automated reminder from HealthSphere. You can manage your reminders in the app settings.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending reminder email:', error.message);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (to, userName) => {
  try {
    const transporter = createTransporter();
    
    if (!transporter) {
      return;
    }

    const mailOptions = {
      from: `"HealthSphere" <${process.env.EMAIL_USER}>`,
      to,
      subject: '🎉 Welcome to HealthSphere!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { margin: 15px 0; padding: 15px; background: white; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏥 Welcome to HealthSphere!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Welcome to HealthSphere - your digital health and wellness companion! 🎉</p>
              
              <h3>Get started with these features:</h3>
              <div class="feature">📊 <strong>Dashboard:</strong> Track your health metrics</div>
              <div class="feature">🏃 <strong>Fitness Tracker:</strong> Monitor your workouts</div>
              <div class="feature">🥗 <strong>Diet Planner:</strong> Plan your meals</div>
              <div class="feature">🤖 <strong>AI Health Coach:</strong> Get personalized guidance</div>
              <div class="feature">👥 <strong>Community:</strong> Join health challenges</div>
              
              <p>We're excited to support your wellness journey!</p>
              
              <p>Best regards,<br>The HealthSphere Team</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
  }
};
