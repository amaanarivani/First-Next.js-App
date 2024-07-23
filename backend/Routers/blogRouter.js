const express = require("express");
const Model = require("../models/blogModel");
const blogLikeModel = require("../models/blogLikeModel");
const blogModel = require("../models/blogModel");
const blogViewModel = require("../models/blogViewModel");
const blogCommentModel = require("../models/blogCommentModel");
const User = require("../models/userModel");
var mongoose = require('mongoose');

const router = express.Router();


router.post("/add", (req, res) => {
  console.log(req.body);
  new Model({
    ...req.body.values, userId: req.body.userId, createdAt: Date.now(), updatedAt: Date.now(), viewCount: 0, likeCount: 0, commentCount: 0,
  }).save()
    .then((result) => {
      res.json(result);

    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);

    });
});

router.get("/getall/:page", async (req, res) => {
  try {
    const page = req.params.page;
    const perPage = 5;
    const skip = (page - 1) * perPage;

    const result = await blogModel.find({})
      .skip(skip)

      .limit(perPage)
      .sort({ createdAt: -1 })
    let finalResult = [];
    for (let i = 0; i < result.length; i++) {
      let currentData = result[i];
      let fetchUserData = await User.findById(currentData.userId);
      if (fetchUserData) {
        finalResult.push({ ...currentData._doc, userData: fetchUserData });
      }
    }
    const count = await blogModel.find({}).countDocuments();
    res.status(200).json({ message: "Blog fetch Successfully !!", data: finalResult, totalpages: Math.ceil(count / 5) });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/blog-search", async (req, res) => {
  const { text } = req.body;
  let pattern = new RegExp(text, "i");
  console.log(text + " text search");
  const result = await blogModel.find({ title: { $regex: pattern } });
  const finalResult = [];
  try {
    for (let i = 0; i < result.length; i++) {
      let currentData = result[i];
      let fetchUserData = await User.findById(currentData.userId);
      finalResult.push({ ...currentData._doc, userData: fetchUserData })
    }
    res.status(200).json({ finalResult });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/getsingleblog/:id", async (req, res) => {
  const blogId = req.params.id;
  console.log(blogId + "dwdfdf");
  try {
    const finalResult = await blogModel.findById(blogId)
    const userResult = await User.findById(finalResult.userId);

    await blogModel.findByIdAndUpdate(
      blogId,
      {
        viewCount: finalResult.viewCount + 1,
      }
    );
    res.json({ finalResult, userResult });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/blog-comment", async (req, res) => {
  const { commentOn, commentBy, comment } = req.body;
  console.log(req.body);
  const blogData = await blogModel.findById(commentOn);
  try {
    const result = await blogCommentModel.create({
      commentOn,
      commentBy,
      comment: comment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
    await blogModel.findByIdAndUpdate(
      commentOn,
      {
        commentCount: blogData.commentCount + 1,
      }
    );
    let fetchUserData = await User.findById(commentBy);
    return res.status(200).json({ message: "Comment Done", data: { ...result._doc, userResult: fetchUserData }, });
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});

router.post("/blog-view", async (req, res) => {
  const { userId, blogId } = req.body;
  var id = new mongoose.Types.ObjectId(userId);
  console.log(id);
  let check = await blogModel.findOne({ likedBy: { $in: [id] } })
  if (check) {
    return res.status(400).json({ message: "Blog Already Viewed by the user" });
  }
  else {
    try {
      const result = await blogViewModel.create({
        blogId,
        userId
      })

      return res.status(200).json({ message: "Blog Viewed.", data: result })

    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
});

router.post("/blog-like", async (req, res) => {
  const { blogId, userId } = req.body;
  console.log(req.body);
  let check = await blogModel.findOne({ _id: blogId, likedBy: { $in: [userId] } }).countDocuments();
  console.log(check);
  if (check) {
    console.log("in if");
    const blogData = await blogModel.findById(blogId)
    await blogModel.findByIdAndUpdate(
      blogId,
      {
        likeCount: blogData.likeCount - 1,
        $push: { likedBy: userId },
      }
    );
    await blogModel.findByIdAndUpdate(
      blogId, {
      $pull: { likedBy: userId }
    }
    );
    return res.status(400).json({ message: "Blog Already Liked by the user" });
  } else {
    console.log("else");
    try {
      const blogData = await blogModel.findById(blogId)
      const result = await blogLikeModel.create({
        blogId,
        userId
      });
      await blogModel.findByIdAndUpdate(
        blogId,
        {
          likeCount: blogData.likeCount + 1,
          $push: { likedBy: userId },
        }
      );
      return res.status(200).json({ message: "Blog Liked", data: result })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
});

router.post("/getbyid", async (req, res) => {
  const {userId} = req.body;
  console.log(userId, " userid");
  const result = await blogModel.find({ userId: userId })
  console.log(result, " result");
  let finalResult = [];
  try {
    for (let i = 0; i < result.length; i++) {
      let currentData = result[i];
      let fetchUserData = await User.findById(currentData.userId);
      if (fetchUserData) {
        finalResult.push({ ...currentData._doc, userData: fetchUserData });
      }
    }
    res.status(200).json({data : finalResult});
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
   
  });

router.get("/get-comment/:id", async (req, res) => {
  const blogId = req.params.id;
  console.log(blogId + "blogId");
  const result = await blogCommentModel.find({ commentOn: blogId });
  let finalResult = [];
  let i = 0;
  try {
    for (i = 0; i < result.length; i++) {
      let currentData = result[i];
      let fetchUserData = await User.findById(currentData.commentBy);
      finalResult.push({ ...currentData._doc, userResult: fetchUserData })
    }
    res.status(200).json({ finalResult });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/blog-search", async (req, res) => {
  const { text } = req.body;
  let pattern = new RegExp(text, "i");
  console.log(text + " text search");
  const result = await blogModel.find({ title: { $regex: pattern } });
  console.log(result, " result");
  const finalResult = [];
  try {
    for (let i = 0; i < result.length; i++) {
      let currentData = result[i];
      finalResult.push({ ...currentData._doc })
    }
    res.status(200).json({ finalResult });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/update", async (req, res) => {
  const { Title, Description, myFile, blogId } = req.body;
  console.log(Title);
  console.log(blogId, " blogid");
  // const blogId = req.params.id;
  try {
    const data = await blogModel.findByIdAndUpdate(
      blogId, {
      title: Title,
      description: Description,
      createdAt: Date.now(),
      blogFile: myFile
    }, { new: true })
    console.log(data, "qdwff");
    res.status(200).json({ message: "Blog Updated", data: data })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/update-comment/:id", async (req, res) => {
  const commentId = req.params.id;
  const { comment } = req.body;
  try {
    const isExist = await blogCommentModel.findById(commentId);
    if (isExist) {
      const result = await blogCommentModel.findByIdAndUpdate(commentId, { comment }, { new: true })
      res.status(200).json({ message: "Comment Updated", data: result })
    }
    else {
      res.status(400).json({ message: "comment not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
});

router.delete("/delete/:id", async (req, res) => {
  await blogModel.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json(result);

    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/delete-comment/:id", async (req, res) => {
  const commentId = req.params.id;
  try {
    const isExist = await blogCommentModel.findById(commentId);
    if (isExist) {
      const result = await blogCommentModel.findByIdAndDelete(commentId);
      console.log(result.commentOn + "blog id of comment");
      const blogId = result.commentOn;
      const blogData = await blogModel.findById(blogId);
      await blogModel.findByIdAndUpdate(
        blogId,
        {
          commentCount: blogData.commentCount - 1
        }
      );
      res.status(200).json({ message: "Comment Deleted", data: result })

    }
    else {
      res.status(400).json({ message: "comment not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error })
  }
});

// router.post("/blog-like", async (req, res) => {
//   const { blogId, userId } = req.body;
//   console.log(blogId+"liked blogId");
//   console.log(userId+"liked userId");
//   // console.log(req.body + "blog like api");
//   try {
//     let blog = await blogModel.findById(blogId)
//     if (!blog) {
//       return res.status(400).json({ message: "blog not found !!" })
//     }
//     let check = await blogLikeModel.findOne({ blogId: blogId, "likes.userId": userId })
//     if (check) {
//       await blogLikeModel.findOneAndUpdate({ blogId: blogId, "likes.userId": userId }, { "$set": { "likes.$.isBlogLiked": true } }, { new: true })
//       return res.json({ message: "Blog likedddd" })
//     }
//     let likeblog = await blogLikeModel.findOneAndUpdate({ blogId }, { $push: { likes: { isBlogLiked: true, userId: userId } } }, { new: true })
//     res.json({ message: "Blog liked", likeblog });
//   } catch (error) {
//     res.status(409).json({
//       message: error.message,
//     });
//   }
// });




module.exports = router;