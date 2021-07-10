const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
 
module.exports = {
  hashPassword: async (password) => {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  },
  checkPassword: (plainPass, password) => {
    return bcrypt.compareSync(plainPass, password);
  },
  getToken: user => {
    return jwt.sign({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role
    }, `${process.env.JWT_SECRET}`);
  }, 
  isAuth: (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({message: 'Access denied!'})
    }
     try{
      const onlyToken = token.slice(7, token.length);
      const verifiedUser = jwt.verify(onlyToken, process.env.JWT_SECRET);
      req.user = verifiedUser;
      next();
     } catch(e){
       return res.status(400).send({message: 'Invalid token'});
     }
  }
}