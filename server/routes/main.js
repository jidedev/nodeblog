const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * GET /
 * HOME
*/
router.get('', async (req, res) => {
  try {
    const locals = {
      title: "NodeJs Blog",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await Post.aggregate([ { $sort: { createdAt: -1 } } ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments({});
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', { 
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});

// router.get('', async (req, res) => {
//   const locals = {
//     title: "NodeJs Blog",
//     description: "Simple Blog created with NodeJs, Express & MongoDb."
//   }

//   try {
//     const data = await Post.find();
//     res.render('index', { locals, data });
//   } catch (error) {
//     console.log(error);
//   }

// });


/**
 * GET /
 * Post :id
*/
router.get('/post/:id', async (req, res) => {
  try {
    let slug = req.params.id;

    const data = await Post.findById({ _id: slug });

    const locals = {
      title: data.title,
      description: "Simple Blog created with NodeJs, Express & MongoDb.",
    }

    res.render('post', { 
      locals,
      data,
      currentRoute: `/post/${slug}`
    });
  } catch (error) {
    console.log(error);
  }

});


/**
 * POST /
 * Post - searchTerm
*/
router.post('/search', async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "Simple Blog created with NodeJs, Express & MongoDb."
    }

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")

    const data = await Post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') }},
        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') }}
      ]
    });

    res.render("search", {
      data,
      locals,
      currentRoute: '/'
    });

  } catch (error) {
    console.log(error);
  }

});


/**
 * GET /
 * About
*/
router.get('/about', (req, res) => {
  res.render('about', {
    currentRoute: '/about'
  });
});


// function insertPostData () {
//   Post.insertMany([
//     {
//       title: "Academic Tips for the Final Year",
//       body: "Balancing Your Final Year Project and Coursework"
//     },
//     {
//       title: "Preparing for the Job Market: Resume Tips",
//       body: "A Guide to Job Interviews: Common Questions and How to Answer Them..."
//     },
//     {
//       title: "How to Transition Smoothly from College to Career",
//       body: "Practical tips for navigating the shift from life in the University to the working world, and adapting your skills for a professional environment."
//     },
//     {
//       title: "Looking Back: What I Wish I Knew as a 100L Student",
//       body: "Key lessons and insights I wish I'd known as a fresher to make the most of campus life, from academics to personal growth."
//     },
//     {
//       title: "FYB Events Planning",
//       body: "A guide to planning the perfect FYB Week."
//     },
//     {
//       title: "Financial Planning for New Graduates",
//       body: "Building a Savings Plan: Financial Tips for New Graduates."
//     },
//     {
//       title: "Creating a Personal Growth Plan",
//       body: "Setting Career Goals for Your First Year After Graduation."
//     },
//     {
//       title: "Tips for International Opportunities",
//       body: "How to Apply for International Internships and Jobs."
//     },
//     {
//       title: "How to Stay Connected with Your Classmates After Graduation",
//       body: "Tips for maintaining meaningful connections with classmates after graduation."
//     },
//     {
//       title: "Handling Setbacks in Your Final Year",
//       body: "Learning from Failures: Building Resilience Before Graduation."
//     },
//   ])
// }

// insertPostData();


module.exports = router;
