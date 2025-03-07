import cron from "node-cron";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { sendJobEmail } from "./emailService.js";

const generateHTML = (userRecommendations) => {
  let htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .user-section { margin-bottom: 30px; }
          .user-name { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
          .job-card {
            width : 40vw;
            margin : 20px 0;
            border: 1px solid #ddd;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
          .job-title { font-size: 18px; font-weight: bold; }
          .company-name { font-size: 16px; color: gray; }
          .location { font-size: 14px; color: #555; }
          .company-logo { width: 50px; height: 50px; border-radius: 5px; }
          a {
            text-decoration: none;
            margin: 2rem 0;
            padding: 4px 10px;
            background-color: rgb(100, 100, 223);
            color: white;
            font-size: small;
        }
        </style>
      </head>
      <body>
        <h2>Job Recommendations</h2>`;

  for (const recommendation of userRecommendations) {
    htmlContent += `
      <div class="user-section">
        <div class="user-name">${recommendation.user.name}</div>`;

    recommendation.jobs.forEach((job) => {
      htmlContent += `
        <div class="job-card">
          <img class="company-logo" src="${job.companyLogo}" alt="Logo">
          <div class="job-title">${job.title}</div>
          <div class="company-name">${job.companyName}</div>
          <div class="location">${job.location}</div>
          <a href="https://hirred-rosy.vercel.app/job/${job._id}" target="_blank">More Details</a>
        </div>`;
    });

    htmlContent += `</div>`;
  }

  htmlContent += `</body></html>`;
  return htmlContent;
};

const task = async () => {
  console.log("task started");

  let userRecommendations = [];

  try {
    const [users, jobs] = await Promise.all([
      User.find({
        preferences: { $exists: true, $not: { $size: 0 } },
      })
        .lean()
        .select("-password"),
      Job.find({
        isActive: true,
      })
        .lean()
        .select("title companyName companyLogo location tags"),
    ]);

    for (const user of users) {
      console.log(`For user ${user.firstName} ${user.lastName}`);

      let recommendedJobs = [];

      for (const job of jobs) {
        const userPrefsLower = user.preferences.map((pref) =>
          pref.value.toLowerCase()
        );

        const isMatch = userPrefsLower.some((pref) => {
          const regex = new RegExp(pref, "i");
          return job.tags.some((tag) => regex.test(tag));
        });

        if (isMatch) {
          recommendedJobs.push(job);
        }
      }

      if (recommendedJobs.length > 0) {
        userRecommendations.push({
          user: { id: user._id, name: `${user.firstName} ${user.lastName}` },
          jobs: recommendedJobs,
        });
      }

      const htmlContent = generateHTML(userRecommendations);
      sendJobEmail(
        user.email,
        "🔥 Job Recommendations Just for You!",
        "",
        htmlContent
      );
    }
  } catch (error) {
    console.error("Job recommendation error:", error);
  }
};

// Schedule the task to run every 30 seconds
cron.schedule("0 0 * * 1", task);
