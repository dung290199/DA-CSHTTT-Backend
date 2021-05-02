const express = require("express");
const multer = require("multer");
const path= require('path');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/", upload.single("image"), (req, res) => {
  
  let urlFile=`/${req.file.path}`;
  urlFile = urlFile.slice(9);///Cắt bỏ url /uploads/
  res.send(urlFile);
});
router.get("/:name", (req, res) => {
  const fileName = req.params.name;
  if (!fileName) {
    return res.send({
      status: false,
      message: "no filename specified",
    });
  }
  res.sendFile(path.resolve(`./uploads/${fileName}`));
});

module.exports = router;