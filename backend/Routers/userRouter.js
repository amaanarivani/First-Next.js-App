const express = require("express");
const Model = require('../models/userModel');

const router = express.Router();

router.post("/add", async(req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, password, confirmpassword, myFile } = req.body;
  const check = await Model.find({email}).countDocuments();
  console.log(check);
  if(check){
    return res.status(400).json({message : 'Email Already registered'})
  }
  try {
    const result = await Model.create({
      firstname,
      lastname,
      email,
      password,
      confirmpassword,
      myFile
    });
    res.status(200).json({message: "signup successfull", result});
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/update", async(req, res) => {
  const {result, userId} = req.body;
  try {
    console.log("oijuoijuoijuoi");
    const data = await Model.findByIdAndUpdate(
      userId, 
      {
        firstname: result.firstname,
        lastname: result.lastname,
        email: result.email,
        password: result.password,
        confirmpassword: result.confirmpassword
      } , { new: true })
      console.log(data+"datatatatatatat");
    res.status(200).json({message : "User Details Updated", data : data})
  } catch (error) {
    res.status(500).json({message : error.message});
  }
});


router.get("/getall", (req, res) => {
  Model.find({})
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// : denotes url parameter
router.get("/getbyemail/:email", (req, res) => {
  console.log(req.params.email);
  Model.find({ email: req.params.email })
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getbyid/:id", (req, res) => {
  console.log(req.params.id);
  Model.findById(req.params.id)
    .then((result) => {
      console.log(result);
      res.json(result);

    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});


router.delete("/delete/:id", (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      setTimeout(() => {
        res.json(result);
      }, 2000);

    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/authenticate', (req, res) => {
  Model.findOne(req.body)
    .then((result) => {
      if (result !== null){
        res.json(result);
      } 
      else res.status(400).json({ message: 'login failed' })
    }).catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
})

// getall
// getbyemail
// getbyid
// update

module.exports = router;