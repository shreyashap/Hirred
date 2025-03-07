import cron from "node-cron";
import { User } from "../models/user.model.js";
import { sendJobEmail } from "./emailService.js";

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Update Your Profile</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 100%;
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    h1 {
      color: #4CAF50;
      font-size: 24px;
    }
    p {
      font-size: 16px;
      line-height: 1.5;
      margin: 10px 0;
    }
    .button {
      display: inline-block;
      background-color: #4CAF50;
      color: #ffffff;
      padding: 12px 20px;
      text-decoration: none;
      font-size: 16px;
      border-radius: 4px;
      margin-top: 20px;
    }
    .footer {
      font-size: 12px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Update Your Profile for Better Job Recommendations!</h1>
    <p>Hello,</p>
    <p>We noticed that your profile is missing some important information like skills and preferences.</p>
    <p>To receive better job recommendations, please take a moment to update your profile.</p>
    <p><a href="https://hirred-rosy.vercel.app/update-profile" class="button">Update Profile</a></p>
    <p class="footer">If you have any questions, feel free to reach out to our support team.</p>
  </div>
</body>
</html>`;

const task = async () => {
  console.log("task started");

  try {
    const users = await User.find({
      preferences: { $size: 0 },
      accountType: "applicant",
      skills: { $in: ["", null] },
    }).select("-password");

    if (users && users.length > 0) {
      for (const user of users) {
        console.log(user.email);
        sendJobEmail(
          user.email,
          "Update Your Profile for Better Job Recommendations",
          "Hello, we noticed that you haven't updated your skills or preferences. Please update your profile to receive better job recommendations.",
          html
        );
      }
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

// Schedule the task to run every 30 seconds
cron.schedule("0 12 * * 0", task);
