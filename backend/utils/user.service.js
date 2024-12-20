const Admin = require('../models/adminSchema');
const Student = require('../models/studentSchema');
const Teacher = require('../models/teacherSchema');

async function getOneUserByIdentifier(identifier) {
  try {
    console.log(identifier);

    // Verifica si el identificador es un número
    if (!isNaN(identifier)) {
      const user = await Student.findOne({ rollNum: identifier });
      if (user) return { user, userType: 'Student' };
    }

    // Si no es un número o no se encontró en Student, busca en Admin y Teacher
    let user = await Admin.findOne({ email: identifier });
    if (user) return { user, userType: 'Admin' };

    user = await Teacher.findOne({ email: identifier });
    if (user) return { user, userType: 'Teacher' };

    return null;
  } catch (error) {
    throw new Error('Error al obtener el usuario por identificador');
  }
}

module.exports = { getOneUserByIdentifier };
