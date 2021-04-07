const Tutor = require('../models/tutor.model');
const Schedule = require('../models/schedule.model');
const auth = require('../middlewares/auth.middleware');

module.exports = {
  register: async (req, res, next) => {
    const { username, password, email, fullname, birthday, phone, address, gender, picture, CV } = req.body;

    const hashedPassword = await auth.hashPassword(password);
    const tutor = new Tutor({
      username: username,
      email: email,
      fullname: fullname,
      birthday: birthday,
      phone: phone,
      address: address,
      gender: gender,
      picture: picture,
      CV: CV,
    });
  
    const newTutor = await tutor.save();
    if (newTutor) {
      return res.status(201).send({
        _id: newTutor.id,
        username: newTutor.username,
        password: newTutor.password,
        email: newTutor.email,
        role: newTutor.role,
        fullname: newTutor.fullname,
        birthday: newTutor.birthday,
        phone: newTutor.phone,
        address: newTutor.address,
        gender: newTutor.gender,
        picture: newTutor.picture,
        CV: newTutor.CV,
      });
    } else {
      return res.status(401).send({ message: "Invalid tutor data" });
    }
  },

  login: (req, res, next) => {
    const { username, password } = req.body;
    const hashedPassword = auth.hashPassword(password);
    const signinTutor = Tutor.findOne({
      username: username,
      password: hashedPassword
    });

    if (signinTutor) {
      const token = auth.getToken(signinTutor);
      return res.status(200)
              .header('auth-token', token)
              .send({
                _id: signinTutor.id,
                username: signinTutor.username,
                email: signinTutor.email,
                role: signinTutor.role,
                fullname: signinTutor.fullname,
                birthday: signinTutor.birthday,
                phone: signinTutor.phone,
                address: signinTutor.address,
                gender: signinTutor.gender,
                picture: signinTutor.picture,
                CV: signinTutor.CV,
              });
    } else {
      return res.status(401).send({ message: "Invalid username or password!"});
    }
  },
  
  createSchedule: async (req, res, next) => {
    const { tutorId, tutorName, subject, grade, time, price, image } = req.body;
    const schedule = new Schedule({
      tutorId: tutorId,
      tutorName: tutorName,
      subject: subject,
      grade: grade,
      time: time,
      price: price,
      image: image
    });

    const newSchedule = await schedule.save();
    if (newSchedule) {
      return res.status(201).send({
        _id: newSchedule.id,
        time: newSchedule.time,
        status: newSchedule.status,
        time_created: newSchedule.time_created,
        tutorId: newSchedule.tutorId,
        tutorName: newSchedule.tutorName,
        subject: newSchedule.subject,
        grade: newSchedule.grade,
        price: newSchedule.price,
        image: newSchedule.image,
      });
    } else {
      return res.status(401).send({ message: "Invalid schedule data" });
    }
  },
  
};