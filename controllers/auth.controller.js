const User = require('../models/user.model');
const CV = require('../models/cv.model');
const authMiddleware = require('../middlewares/auth.middleware');
const config = require('../config');

module.exports = {
  login: async (req, res, next) => {
    const { username, password } = req.body;
    const signinUser = await User.findOne({
      username: username,
    });

    if(!authMiddleware.checkPassword(password, signinUser.password)){
      return res.status(401).send({ message: "Invalid password!"});
    }

    console.log("signinUser: ", signinUser);
    if (signinUser) {
      const token = authMiddleware.getToken(signinUser);
      let data = {
        token: token,
        user: {
          _id: signinUser.id,
          username: signinUser.username,
          email: signinUser.email,
          role: signinUser.role,
          fullname: signinUser.fullname,
          birthday: signinUser.birthday,
          phone: signinUser.phone,
          address: signinUser.address,
          gender: signinUser.gender,
          picture: signinUser.picture,
        }
      };
      const cv = (signinUser.role === 'TUTOR') ? await CV.findOne({tutorId: signinUser.id}) : null;
      data = cv
        ? Object.assign({}, data, {
          ...data,
          user: {
            ...data.user,
            CV: signinUser.CV
          }
        })
        :data;
      console.log("data", data);
      return res.status(200)
              .header('auth-token', token)
              .send({ data: data });
    } else {
      return res.status(401).send({ message: "username or email existed!"});
    }
  },

  register: async (req, res, next) => {
    const { username, password, email, fullname, birthday, phone, address, gender, picture, role } = req.body;

    const cvDetail = config.userRole[1] === role ? req.body.cv : null; 
    const hashedPassword = await authMiddleware.hashPassword(password);

    const user = new User({
      username: username,
      password: hashedPassword,
      email: email,
      role: role,
      fullname: fullname,
      birthday: birthday,
      phone: phone,
      address: address,
      gender: config.gender[gender],
      picture: picture,
    });
    
    const newUser = await user.save();
    if (newUser) {
      const token = authMiddleware.getToken(newUser);
      let data = {
        token: token,
        user: {
          _id: newUser.id,
          username: newUser.username,
          password: newUser.password,
          email: newUser.email,
          role: newUser.role,
          fullname: newUser.fullname,
          birthday: newUser.birthday,
          phone: newUser.phone,
          address: newUser.address,
          gender: newUser.gender,
          picture: newUser.picture,
        }
      }
      if( cvDetail ) {
        const cv = new CV({
          tutorId: newUser.id,
          CV: cvDetail
        });
        const newCV = await cv.save();
        data = newCV ? { 
                        ...data, 
                        user: {
                          ...data.user,
                          CV: newCV.CV
                        } 
                      } 
                      : data;
        console.log("go out");
      }
      return res.status(201)
              .header('auth-token', token)
              .send({ data: data });
    } else {
      return res.status(401).send({ message: "Invalid tutor data" });
    }
  },
}