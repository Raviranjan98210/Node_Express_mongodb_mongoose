const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.error("Mongodb is not connected", err));

//   Creating schema for the course
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

// function for inserting new courses to mongodb database
async function createCourse(newCourse) {
  // pass new course object in this function
  const course = new Course(newCourse);

  const result = await course.save();
  console.log(result);
}

// getting all the courses from the mongodb database
async function getCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function queryCourse() {
  const result = await Course.find({ author: "ravi", isPublished: true })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, author: 1 });
  console.log(result);
}

//Comparison query and logical query

// eq (equal to)
//neq (not equal)
// gt (Greater than )
// gte (Greater than or equal)
// lt (less than)
// lte (less than or euqal)
// in
// nin (not in)
// or() parameter would be array  for mutiple filter
// and()

async function advQuery() {
  const result = await Course
    // find({ price: { $in: [1200, 1500] } });
    // .find({ price: { $gt: 1500 } });
    .find()
    .or([{ author: "Mosh" }, { price: { $gte: 1500 } }]);

  //similarly all operator will be done

  console.log(result);
}

// Query using regular expression
async function regExQuery() {
  // const result = await Course.find({ author: /^Ravi/i }); //Name starts with ravi and i denotes here case insenstive
  const result = await Course.find({ author: /TRAVERSY$/i }); //Name ends with traversy case insenstive
  // .count()    we can add count methods as well to find out total no. of documents available for this particular query

  // in general we can put any regex as value with any key in the filter object
  console.log(result);
}

async function updateCourse(id) {
  //Method-1 > 1.Query first
  //2. get the result then update them
  // print the update value

  // const course = await Course.findById(id);
  // if (!course) return;
  // course.author = "Ravi Ranjan Kumar";
  // course.price = 40;

  // const result = await course.save();
  // console.log(result);

  // Method-2 > Update the value first then log them out

  const result = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        name: "Mern stack by Brad Traversy",
        author: "Brad Traversy",
      },
    },
    { new: true }
  );
  console.log(result);
}

async function deleteCourse(id) {
  //Method-1
  // const result = await Course.deleteOne({ _id: id }); // we can deleteMany() to delete many documents by using filter object
  // console.log(result);

  //Method-2

  const course = await Course.findByIdAndRemove(id);
  console.log(`${course.name} course is deleted.`);
}

const course = {
  name: "Mevn stack",
  author: "Brad Traversy",
  tags: ["Full stack Developer", "Backend Developer", "frontend Developer"],
  isPublished: true,
  price: 1800,
};

// createCourse(course);
// getCourses();
// queryCourse();
// advQuery();
// regExQuery();
// updateCourse("5f1716f395032a292ebcef41");
// deleteCourse("5f1716f395032a292ebcef41");
deleteCourse("5f171d5effc51f2ab79a50a2");
