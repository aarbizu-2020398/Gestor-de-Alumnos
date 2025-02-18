
import Curso from '../Cursos/cursos.model.js';
import Alumno from '../Alumnos/alumnos.model.js';
import Maestro from '../Maestros/maestros.model.js';

export const esRolValido = async (rol = '') => {
    const existeRol = await Rol.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no existe en la base de datos`);
    }
};

export const existeEmail = async (email = '') => {
    const existe = await Alumno.findOne({ email }) || await Maestro.findOne({ email });
    if (existe) {
        throw new Error(`El correo ${email} ya está registrado en la base de datos`);
    }
};

export const existeAlumnoPorId = async (id = '') => {
    const alumno = await Alumno.findById(id);
    if (!alumno) {
        throw new Error(`El alumno con el id ${id} no existe en la base de datos`);
    }
};

export const existeCursoPorId = async (id = '') => {
    const curso = await Curso.findById(id);
    if (!curso) {
        throw new Error(`El curso con el id ${id} no existe en la base de datos`);
    }
};

export const existeMaestroPorId = async (id = '') => {
    const maestro = await Maestro.findById(id);
    if (!maestro) {
        throw new Error(`El maestro con el id ${id} no existe en la base de datos`);
    }
};

export const existeAlumnoEnCurso = async (idAlumno = '', idCurso = '') => {
    const alumno = await Alumno.findById(idAlumno);
    if (!alumno) {
        throw new Error(`El alumno con id ${idAlumno} no existe`);
    }

    const estaInscrito = alumno.cursos.some(curso => curso.toString() === idCurso);
    if (!estaInscrito) {
        throw new Error(`El alumno con id ${idAlumno} no está inscrito en el curso con id ${idCurso}`);
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
