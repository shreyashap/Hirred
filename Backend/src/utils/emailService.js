import nodemailer from "nodemailer";

const resetPasswordPage = (resetLink) => {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        text-align: center;
        padding: 10px;
        background-color: #4a90e2;
        color: #ffffff;
      }
      .content {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      }
      .button {
        display: inline-block;
        padding: 12px 24px;
        margin: 20px 0;
        color: #ffffff;
        background-color: #4a90e2;
        text-decoration: none;
        border-radius: 5px;
        font-size: 16px;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #666666;
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Reset Your Password</h1>
      </div>
      <div class="content">
        <p>Hi,</p>
        <p>You recently requested to reset your password. Click the button below to reset it.</p>
        <a href="${resetLink}" class="button">Reset Password</a>
      </div>
      <div class="footer">
        <p>Hirred</p>
      </div>
    </div>
  </body>
</html>
`;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, resetLink) => {
  const html = resetPasswordPage(resetLink);
  try {
    const emailResponse = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", emailResponse.messageId);
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

const sendJobEmail = async (to, subject, text, html) => {
  try {
    const emailResponse = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent:", emailResponse.messageId);
    return emailResponse;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

export { sendEmail, sendJobEmail };
