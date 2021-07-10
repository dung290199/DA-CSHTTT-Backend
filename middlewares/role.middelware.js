const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
 
module.exports = {
  isTutor: (req, res, next) => {
    if (!token) {
      return res.status(401).send({message: 'Access denied!'})
    }
     try{
       const verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
       req.user = verifiedUser;
       next();
     } catch(e){
       return res.status(400).send({message: 'Invalid token'});
     }
  }
}