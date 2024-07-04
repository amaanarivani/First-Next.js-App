const express = require("express");
const Model = require("../models/blogModel");
const blogLikeModel = require("../models/blogLikeModel");
const blogModel = require("../models/blogModel");
const blogViewModel = require("../models/blogViewModel");
const User = require("../models/userModel");
var mongoose = require('mongoose');

const router = express.Router();

router.post("/add", (req, res) => {
  console.log(req.body);
  new Model({
    ...req.body.values, userId: req.body.userId, createdAt: Date.now(), updatedAt: Date.now(), viewCount: 0, likeCount: 0,
  }).save()
    .then((result) => {
      res.json(result);

    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);

    });
});

router.get("/getall", (req, res) => {
  Model.find({})
    .then(async (result) => {
      let finalResult = [];
      let i = 0;
      for (i = 0; i < result.length; i++) {
        let currentData = result[i];
        let fetchUserData = await User.findById(currentData.userId);
        // console.log(fetchUserData);
        if (fetchUserData) {
          finalResult.push({ ...currentData._doc, userData: fetchUserData });
        }
      }
      res.json(finalResult);
    })
    .catch((err) => {
      console.log("catch");
      console.log(err);
      res.status(500).json(err);
    });
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
  let check = await blogModel.findOne({ _id : blogId, likedBy: { $in: [userId] } }).countDocuments();
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

router.get("/getbyid/:id", (req, res) => {
  console.log(req.params.id);
  blogModel.find({ userId: req.params.id })
    .then(async (result) => {
      let finalResult = [];
      let i = 0;
      for (i = 0; i < result.length; i++) {
        let currentData = result[i];
        let fetchUserData = await User.findById(currentData.userId);
        if (fetchUserData) {
          finalResult.push({ ...currentData._doc, userData: fetchUserData });
        }
      }
      res.json(finalResult);

    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
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

router.put("/update/:id", (req, res) => {
  blogModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  blogModel.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json(result);

    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
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