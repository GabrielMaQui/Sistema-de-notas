
const Admin = require('../models/adminSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');

async function getOneUserEmail(email) {
  try {
    let user = await Admin.findOne({ email });
    if (user) return user;

    user = await Student.findOne({ email });
    if (user) return user;

    user = await Teacher.findOne({ email });
    if (user) return user;

    return null; // No se encontró usuario
  } catch (error) {
    throw new Error('Error al obtener el usuario por email');
  }
}

module.exports = { getOneUserEmail };
