import { response, request } from "express";
import { hash } from "argon2";
import Alumno from "./alumno.model.js";

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
        const alumno = await Alumno.findById(id);

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
        const data = {};

        if (password) {
            data.password = await hash(password);
        }

        const alumno = await Alumno.findByIdAndUpdate(id, data, { new: true });

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
        const authenticatedUser = req.user;

        res.status(200).json({
            success: true,
            msg: 'Alumno desactivado correctamente',
            alumno,
            authenticatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar el alumno',
            error
        });
    }
};
