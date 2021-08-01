const express = require("express");
const multer = require("multer");
const path= require('path');

require('dotenv').config()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {

  const data = {
    image: req.file,
  }
  
  cloudinary.uploader.upload(data.image.path)
    .then((result) => {
      return res.status(200).send({
        message: "success",
        result,
      });
    }).catch((error) => {
      return res.status(500).send({
        message: "failure",
        error,
      });
    });
});

// router.get("/:name", (req, res) => {
//   const fileName = req.params.name;
//   if (!fileName) {
//     return res.send({
//       status: false,
//       message: "no filename specified",
//     });
//   }
//   res.sendFile(path.resolve(`./uploads/${fileName}`));
// });

module.exports = router;