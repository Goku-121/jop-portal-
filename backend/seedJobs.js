const mongoose = require("mongoose");
const Job = require("./models/Job");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Locations in Bangladesh
const locations = [
  "Dhaka",
  "Chittagong",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Mymensingh",
  "Comilla",
  "Cox's Bazar",
];

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
  "Delivery Person",
];

// ✅ Category keywords for image search
const imgKeywordMap = {
  Plumber: "plumber,tools",
  Electrician: "electrician,electrical",
  Driver: "driver,car",
  Cleaner: "cleaning,janitor",
  Carpenter: "carpenter,woodwork",
  Painter: "painter,painting",
  Mechanic: "mechanic,workshop",
  Gardener: "gardener,garden",
  Welder: "welder,welding",
  "Construction Laborer": "construction,worker",
  "HVAC Technician": "hvac,air-conditioner",
  "Pest Control Specialist": "pest-control,spraying",
  "Laundry Worker": "laundry,washing",
  "Security Guard": "security,guard",
  "Delivery Person": "delivery,courier",
};

function buildImageUrl(jobBaseTitle, uniqueSeed) {
  // ✅ per job unique image (no cache issue)
  return `https://picsum.photos/seed/${encodeURIComponent(jobBaseTitle + "-" + uniqueSeed)}/800/520`;
}

// Optional companies/users for assignment
const companies = []; // put company IDs if you want

async function seedJobs() {
  try {
    await Job.deleteMany({});
    console.log("Old jobs deleted");

    const batch = [];

    for (let i = 0; i < 10000; i++) {
      const baseTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
      const title = `${baseTitle} #${i + 1}`;

      const description = `We are looking for a skilled ${baseTitle} in your area. Excellent opportunity with competitive salary.`;
      const location = locations[Math.floor(Math.random() * locations.length)];
      const salary = `${Math.floor(Math.random() * 30000 + 8000)} BDT`;

      const postedBy =
        companies.length > 0
          ? companies[Math.floor(Math.random() * companies.length)]
          : undefined;

      const imageUrl = buildImageUrl(baseTitle, i + 1);

      batch.push({ title, description, location, salary, postedBy, imageUrl });

      if (batch.length === 1000) {
        await Job.insertMany(batch);
        batch.length = 0;
        console.log(`${i + 1} jobs inserted so far...`);
      }
    }

    if (batch.length > 0) {
      await Job.insertMany(batch);
      console.log("Remaining jobs inserted.");
    }

    console.log(" 10,000 jobs inserted with imageUrl successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedJobs();