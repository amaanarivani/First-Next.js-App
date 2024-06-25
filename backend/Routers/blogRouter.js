const express = require("express");
const Model = require("../models/blogModel");
const User = require("../models/userModel");

const router = express.Router();

router.post("/add", (req, res) => {
    console.log(req.body);
    new Model({
      ...req.body.values,userId : req.body.userId, createdAt : Date.now(), updatedAt : Date.now()
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
      let i=0;
      for(i=0; i<result.length; i++){
        let currentData = result[i];
        let fetchUserData  = await User.findById(currentData.userId);
        if (fetchUserData){
          finalResult.push({...currentData._doc, userData : fetchUserData});
        }
      }
      res.json(finalResult);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  });
      
  router.get("/getbyid/:id", (req, res) => {
    console.log(req.params.id);
    Model.find({userId : req.params.id})
    .then(async (result) => {
      let finalResult = [];
      let i=0;
      for(i=0; i<result.length; i++){
        let currentData = result[i];
        let fetchUserData  = await User.findById(currentData.userId);
        if (fetchUserData){
          finalResult.push({...currentData._doc, userData : fetchUserData});
        }
      }
      res.json(finalResult);
      
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  });

  router.get("/getsingleblog/:id", (req, res) => {
    console.log(req.params.id);
    Model.findById(req.params.id)
    .then(async (result) => {
      let finalResult;
      let userResult;
      userResult = await User.findById(result.userId);
      finalResult = {...result._doc, userData : userResult}
      res.json(finalResult);
      
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  });
  
  router.put("/update/:id", (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, {new : true})
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  });
  
  router.delete("/delete/:id", (req, res) => {
    Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.json(result);
      
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
  });




module.exports = router;