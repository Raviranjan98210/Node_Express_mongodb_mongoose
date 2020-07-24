const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/mongoexercise", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log("Sorry connection failed", err);
  });

const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  price: Number,
  isPublished: Boolean,
});

const Course = mongoose.model("course", courseSchema);
async function getFullstackCourse() {
  const result = await Course.find({
    isPublished: true,
    tags: { $in: ["frontend", "backend"] },
  })
    .sort({ price: -1 })
    .select({ name: 1, author: 1, price: 1 });

  console.log(result);
}
getFullstackCourse();
