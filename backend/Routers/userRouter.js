const express = require("express");
const Model = require('../models/userModel');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post("/add", async (req, res) => {
  console.log(req.body);
  const { firstname, lastname, email, password, confirmpassword, myFile } = req.body.values;
  console.log(firstname, " name user");
  const hashedPassword = await bcrypt.hash(password, 2);
  console.log(hashedPassword, " hash");
  const check = await Model.find({ email }).countDocuments();
  console.log(check);
  if (check) {
    return res.status(400).json({ message: 'Email Already registered' })
  }
  try {
    const result = await Model.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      confirmpassword: hashedPassword,
      myFile
    });
    res.status(200).json({ message: "signup successfull", result });
  } catch (error) {
    res.status(500).json({message : "Something went wrong"});
  }
});

router.post("/update", async (req, res) => {
  const { result, myFile, userId } = req.body;
  try {
    const data = await Model.findByIdAndUpdate(
      userId,
      {
        firstname: result.firstname,
        lastname: result.lastname,
        myFile: myFile
      }, { new: true })
    console.log(data + "datatatatatatat");
    res.status(200).json({ message: "User Details Updated", data: data })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/update-password", async (req, res) => {
  const { currentPassword, newPassword, userId } = req.body;
  const result = await Model.findById(userId)
  const checkPassword = await bcrypt.compare(currentPassword, result.password)
  console.log(checkPassword, " check pass");
  if(!checkPassword){
    return res.status(400).json({message: 'Current Password does not match'})
  }
  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 2);
    const data = await Model.findByIdAndUpdate(
      userId,
      {
        password: hashedNewPassword,
        confirmpassword: hashedNewPassword
      }, { new: true })
    console.log(data + "datatatatatatat");
    res.status(200).json({ message: "Password Changed Successfully", data: data })
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

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

router.post('/authenticate', async (req, res) => {
  const { email, password } = req.body;
  const result = await Model.findOne({ email: email });
  if (result == null) {
    return res.status(400).json({ message: 'User not exist with this email' })
  }
  const samePassword = await bcrypt.compare(password, result.password)
  // console.log(samePassword, " same p");
  try {
    if (result.email == email && samePassword) {
      res.status(200).json({ data: result });
    } else {
      res.status(400).json({ message: 'Password is incorrect' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
})

// getall
// getbyemail
// getbyid
// update

module.exports = router;