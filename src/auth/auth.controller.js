import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import Teacher from '../Teachers/teacher.model.js';
import Student from '../Students/student.model.js';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let usuario = await Teacher.findOne({ email });

        if (!usuario) {
            usuario = await Student.findOne({ email });
        }

        if (!usuario) {
            return res.status(400).json({
                success: false,
                msg: 'Usuario no encontrado'
            });
        }

        const validPassword = await argon2.verify(usuario.password, password);
        if (!validPassword) {
            return res.status(400).json({
                success: false,
                msg: 'Contraseña incorrecta'
            });
        }

        const token = jwt.sign(
            { uid: usuario._id, role: usuario.role },
            process.env.SECRETORPRIVATEKEY,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            msg: 'Login exitoso',
            token,
            usuario: {
                uid: usuario._id,
                name: usuario.name,
                surname: usuario.surname,
                email: usuario.email,
                role: usuario.role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: 'Error en el servidor'
        });
    }
};
