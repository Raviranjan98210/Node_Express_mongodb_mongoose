const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/mongoexercise", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((err) => {
    console.error("Not connected to databse", err);
  });

const courseSchema = new mongoose.Schema({
  tag: [String],
  name: String,
  author: String,
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("course", courseSchema);

async function getCourses() {
  return await Course.find({ isPublished: true, tags: "backend" })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
