const mongoose = require("mongoose");
const Job = require("./models/Job");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const locations = ["Dhaka", "Chittagong", "Sylhet", "Khulna", "Rajshahi", "Barishal", "Mymensingh", "Comilla", "Cox's Bazar"];

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

const imageMap = {
  Plumber: "https://source.unsplash.com/900x600/?plumber,tools",
  Electrician: "https://source.unsplash.com/900x600/?electrician,electrical",
  Driver: "https://source.unsplash.com/900x600/?driver,car",
  Cleaner: "https://source.unsplash.com/900x600/?cleaning,housekeeping",
  Carpenter: "https://source.unsplash.com/900x600/?carpenter,woodworking",
  Painter: "https://source.unsplash.com/900x600/?painter,painting",
  Mechanic: "https://source.unsplash.com/900x600/?mechanic,garage",
  Gardener: "https://source.unsplash.com/900x600/?gardener,garden",
  Welder: "https://source.unsplash.com/900x600/?welder,welding",
  "Construction Laborer": "https://source.unsplash.com/900x600/?construction,worker",
  "HVAC Technician": "https://source.unsplash.com/900x600/?hvac,technician",
  "Pest Control Specialist": "https://source.unsplash.com/900x600/?pest,control",
  "Laundry Worker": "https://source.unsplash.com/900x600/?laundry,clean",
  "Security Guard": "https://source.unsplash.com/900x600/?security,guard",
  "Delivery Person": "https://source.unsplash.com/900x600/?delivery,courier",
};

const companies = [];

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

      const postedBy = companies.length ? companies[Math.floor(Math.random() * companies.length)] : undefined;

      const imageUrl = imageMap[baseTitle] || "https://source.unsplash.com/900x600/?job,work";

      batch.push({ title, description, location, salary, postedBy, imageUrl });

      if (batch.length === 1000) {
        await Job.insertMany(batch);
        batch.length = 0;
        console.log(`${i + 1} jobs inserted so far...`);
      }
    }

    if (batch.length) await Job.insertMany(batch);

    console.log("✅ 10,000 jobs inserted successfully with internet images!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedJobs();