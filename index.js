const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to mongodb"))
  .catch((err) => console.error("Mongodb is not connected", err));

//***********************************************Creating schema with proper validation************************************************************** */

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100,
    // match: /pattern/ we can put regex as well
  },
  category: {
    type: String,
    enum: ["web", "mobile", "novel", "android"], // it enables to choose only mentioned category otherwise it will throw an error
    required: true,
    lowercase: true,
  },
  author: String,
  tags: {
    type: Array,
    // required: true,
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "A course should have at least one tag",
    },
  },

  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 100,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model("Course", courseSchema);

//**************************************************CREATING COURSE******************************************************************* */
// function for inserting new courses to mongodb database
async function createCourse(newCourse) {
  // pass new course object in this function
  const course = new Course(newCourse);
  try {
    const result = await course.save();
    console.log(result);
  } catch (err) {
    for (field in err.errors) {
      console.log(`${err.errors[field].message}`);
    }
  }
}

// *************************************************GETTING ALL THE COURSES********************************************************************

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

// ***********************************************COMPARISON QUERY******************************************************************

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

//***************************************************QUERY USING REGULAR EXPRESSION*********************************************** */

// Query using regular expression
async function regExQuery() {
  // const result = await Course.find({ author: /^Ravi/i }); //Name starts with ravi and i denotes here case insenstive
  const result = await Course.find({ author: /TRAVERSY$/i }); //Name ends with traversy case insenstive
  // .count()    we can add count methods as well to find out total no. of documents available for this particular query

  // in general we can put any regex as value with any key in the filter object
  console.log(result);
}

// ***************************************************CALLING FUNCTIONS*************************************************************
const course = {
  name: "Lets make code beutiful",
  category: "MOBILE",
  author: "Sachin Bhandari",
  tags: ["LPU", "JavaScript geek", "Genius"],

  isPublished: true,
  price: 10.65,
};

createCourse(course);
// getCourses();
// queryCourse();
// advQuery();
// regExQuery();
