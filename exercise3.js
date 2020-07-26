const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost/mongoexercise", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("conneted to mongodb");
  })
  .catch((err) => {
    console.log("Connection failed", err);
  });

const courseSchema = mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  price: Number,
});

const Course = mongoose.model("course", courseSchema);

async function getCourse() {
  const result = await Course.find({ isPublished: true }).or([
    { name: /.*by.*/i },
    { price: { $gte: 15 } },
  ]);
  console.log(result);
}

getCourse();
