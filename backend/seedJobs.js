const mongoose = require("mongoose");
const Job = require("./models/Job");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Locations in Bangladesh
const locations = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Mymensingh", "Comilla", "Cox's Bazar"];

// Service / Trade jobs
const jobTitles = [
  "Plumber",
  "Electrician",
  "Driver",
  "Cleaner",
  "Carpenter",
  "Painter",
  "Mechanic",
  "Gardener",
  "Welder",
  "Construction Laborer",
  "HVAC Technician",
  "Pest Control Specialist",
  "Laundry Worker",
  "Security Guard",
  "Delivery Person"
];

// Optional companies/users for assignment (fill if you have company IDs)
const companies = []; // e.g., ["644c1a9e2f4b3c0012345678", "644c1a9e2f4b3c0012345679"]

async function seedJobs() {
  try {
    // Clear existing jobs
    await Job.deleteMany({});
    console.log("Old jobs deleted");

    const jobs = [];

    for (let i = 0; i < 10000; i++) {
      const title = jobTitles[Math.floor(Math.random() * jobTitles.length)] + ` #${i + 1}`;
      const description = `We are looking for a skilled ${title} in your area. Excellent opportunity with competitive salary.`;
      const location = locations[Math.floor(Math.random() * locations.length)];
      const salary = `${Math.floor(Math.random() * 30000 + 8000)} BDT`; // Random salary 8k-38k

      const postedBy = companies.length > 0 ? companies[Math.floor(Math.random() * companies.length)] : undefined;

      jobs.push({ title, description, location, salary, postedBy });

      // Insert in batches to avoid memory overload
      if (jobs.length === 1000) {
        await Job.insertMany(jobs);
        jobs.length = 0; // clear array
        console.log(`${i + 1} jobs inserted so far...`);
      }
    }

    // Insert any remaining jobs
    if (jobs.length > 0) {
      await Job.insertMany(jobs);
      console.log("Remaining jobs inserted.");
    }

    console.log("10,000 service jobs inserted successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedJobs();
