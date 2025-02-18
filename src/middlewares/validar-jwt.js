import jwt from 'jsonwebtoken';
import Alumno from '../Alumnos/alumnos.model.js';
import Maestro from '../Maestros/maestros.model.js';
import Curso from '../Cursos/cursos.model.js';

export const validarJWT = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        let usuario = await Alumno.findById(uid) || await Maestro.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Usuario no existe en la base de datos'
            });
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario desactivado'
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
};

export const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe en la base de datos`);
    }
};

export const existeEmail = async (email = '') => {
    const existe = await Alumno.findOne({ email }) || await Maestro.findOne({ email });

    if (existe) {
        throw new Error(`El correo ${email} ya existe en la base de datos`);
    }
};

export const existeAlumnoPorId = async (id = '') => {
    const alumno = await Alumno.findById(id);

    if (!alumno) {
        throw new Error(`El alumno con el id ${id} no existe en la base de datos`);
    }
};

export const existeMaestroPorId = async (id = '') => {
    const maestro = await Maestro.findById(id);

    if (!maestro) {
        throw new Error(`El maestro con el id ${id} no existe en la base de datos`);
    }
};

export const existeCursoPorId = async (id = '') => {
    const curso = await Curso.findById(id);

    if (!curso) {
        throw new Error(`El curso con el id ${id} no existe en la base de datos`);
    }
};

export const verificarCupoCurso = async (idCurso = '') => {
    const curso = await Curso.findById(idCurso);

    if (!curso) {
        throw new Error(`El curso con id ${idCurso} no existe en la base de datos`);
    }

    if (curso.alumnos.length >= curso.maxAlumnos) {
        throw new Error(`El curso con id ${idCurso} ha alcanzado el número máximo de alumnos permitidos`);
    }
};
