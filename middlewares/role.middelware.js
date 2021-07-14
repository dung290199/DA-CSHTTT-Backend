const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
 
module.exports = {
  isTutor: (req, res, next) => {
    if (req.user.role === 'TUTOR') {
      next();
    } else {
      return res.status(400).send({message: `User's role is invalid`});
    }
  },

  isAdmin: (req, res, next) => {
    if (req.user.isAdmin){
      next();
    } else {
      return res.status(400).send({message: 'Invalid token'});
    }
  }
}