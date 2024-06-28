// const multer = require('multer');
const express = require('express');

const router = express.Router();

router.post("/uploadfile", async(req, res) => {
    const body = req.body;
    console.log(body);
    try {
        const newImage = await Post.create(body);
        newImage.save();
        res.status(201).json({ message: "new image uploaded", createdPost: newImage });
    } catch (error) {
        res.status(409).json({
            message: error.message,
        });
    }
});

module.exports = router;