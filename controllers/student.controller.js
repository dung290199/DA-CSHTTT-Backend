// const Student = require('../models/student.model');
// const bcrypt = require('bcryptjs');

// module.exports = {
//   register: async (req, res, next) => {
//     const { username, password, email, fullname, birthday, phone, address, gender, picture } = req.body;
    
//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const student = new Student({
//       username: username,
//       password: password,
//       email: email,
//       fullname: fullname,
//       birthday: birthday,
//       phone: phone,
//       address: address,
//       gender: gender,
//       picture: picture,
//     });
  
//     const newStudent = await student.save();
//     if (newStudent) {
//       return res.status(201).send({
//         _id: newStudent.id,
//         username: newStudent.username,
//         password: newStudent.password,
//         email: newStudent.email,
//         fullname: newStudent.fullname,
//         birthday: newStudent.birthday,
//         phone: newStudent.phone,
//         address: newStudent.address,
//         gender: newStudent.gender,
//         picture: newStudent.picture,
//       });
//     } else {
//       return res.status(401).send({ message: "Invalid student data" });
//     }
//   }
// };
