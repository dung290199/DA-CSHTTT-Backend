// const Tutor = require('../models/tutor.model');
// const Schedule = require('../models/schedule.model');
// const auth = require('../middlewares/auth.middleware');

// module.exports = {
//   createSchedule: async (req, res, next) => {
//     const { tutorId, tutorName, subject, grade, time, price, image } = req.body;
//     const schedule = new Schedule({
//       tutorId: tutorId,
//       tutorName: tutorName,
//       subject: subject,
//       grade: grade,
//       time: time,
//       price: price,
//       image: image
//     });

//     const newSchedule = await schedule.save();
//     if (newSchedule) {
//       return res.status(201).send({
//         _id: newSchedule.id,
//         time: newSchedule.time,
//         status: newSchedule.status,
//         time_created: newSchedule.time_created,
//         tutorId: newSchedule.tutorId,
//         tutorName: newSchedule.tutorName,
//         subject: newSchedule.subject,
//         grade: newSchedule.grade,
//         price: newSchedule.price,
//         image: newSchedule.image,
//       });
//     } else {
//       return res.status(401).send({ message: "Invalid schedule data" });
//     }
//   },
  
// };