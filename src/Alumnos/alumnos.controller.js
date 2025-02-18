import { response, request } from "express";
import { hash } from "argon2";
import Alumno from "../Alumnos/alumnos.model.js";
import Curso from "../Cursos/cursos.model.js";

export const getAlumnos = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, alumnos] = await Promise.all([
            Alumno.countDocuments(query),
            Alumno.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            alumnos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener alumnos',
            error
        });
    }
};

export const getAlumnoById = async (req, res) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findById(id).populate("cursos");

        if (!alumno) {
            return res.status(404).json({
                success: false,
                msg: 'Alumno no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            alumno
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el alumno',
            error
        });
    }
};

export const updateAlumno = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, email, password, ...data } = req.body;

        const alumno = await Alumno.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Alumno actualizado correctamente',
            alumno
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el alumno',
            error
        });
    }
};

export const updatePasswordAlumno = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        
        if (!password) {
            return res.status(400).json({ msg: 'La contraseña es obligatoria' });
        }

        const encryptedPassword = await hash(password);
        const alumno = await Alumno.findByIdAndUpdate(id, { password: encryptedPassword }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Contraseña actualizada correctamente',
            alumno
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la contraseña',
            error
        });
    }
};

export const deleteAlumno = async (req, res) => {
    try {
        const { id } = req.params;
        const alumno = await Alumno.findByIdAndUpdate(id, { estado: false }, { new: true });
        
        res.status(200).json({
            success: true,
            msg: 'Alumno desactivado correctamente',
            alumno
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar el alumno',
            error
        });
    }
};

export const asignarCurso = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const alumno = await Alumno.findById(studentId);

        if (!alumno) {
            return res.status(404).json({ msg: 'Alumno no encontrado' });
        }

        if (alumno.cursos.length >= 3) {
            return res.status(400).json({ msg: 'No puedes inscribirte en más de 3 cursos.' });
        }

        if (alumno.cursos.includes(courseId)) {
            return res.status(400).json({ msg: 'Ya estás inscrito en este curso.' });
        }

        alumno.cursos.push(courseId);
        await alumno.save();

        res.status(200).json({ msg: 'Curso asignado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al asignar curso', error: error.message });
    }
};

export const desasignarCurso = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        const alumno = await Alumno.findById(studentId);

        if (!alumno) {
            return res.status(404).json({ msg: 'Alumno no encontrado' });
        }

        alumno.cursos = alumno.cursos.filter(id => id.toString() !== courseId);
        await alumno.save();

        res.status(200).json({ msg: 'Curso desasignado correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Error al desasignar curso', error: error.message });
    }
};
