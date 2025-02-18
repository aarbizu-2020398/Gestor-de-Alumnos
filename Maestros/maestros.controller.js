import { response, request } from "express";
import { hash } from "argon2";
import Maestro from "../Maestros/maestros.model.js";

export const getMaestros = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true, role: "TEACHER_ROLE" };

        const [total, maestros] = await Promise.all([
            Maestro.countDocuments(query),
            Maestro.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            maestros
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener maestros',
            error
        });
    }
}

export const getMaestroById = async (req, res) => {
    try {
        const { id } = req.params;
        const maestro = await Maestro.findById(id);

        if (!maestro) {
            return res.status(404).json({
                success: false,
                msg: 'Maestro no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            maestro
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener el maestro',
            error
        });
    }
}

export const registerMaestro = async (req, res) => {
    try {
        const { nombre, apellido, email, password, telefono, especialidad } = req.body;
        let profilePicture = req.file ? req.file.filename : null;

        const encryptedPassword = await hash(password);

        const maestro = await Maestro.create({
            nombre,
            apellido,
            email,
            password: encryptedPassword,
            telefono,
            especialidad,
            role: "TEACHER_ROLE",
            profilePicture
        });

        return res.status(201).json({
            message: "Maestro registrado exitosamente",
            maestro
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error en el registro del maestro',
            error
        });
    }
}

export const updateMaestro = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { _id, email, password, ...data } = req.body;

        const maestro = await Maestro.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Maestro actualizado correctamente',
            maestro
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el maestro',
            error
        });
    }
}

export const updatePasswordMaestro = async (req, res = response) => {
    try {
        const { id } = req.params;
        const { password } = req.body;
        const data = {};

        if (password) {
            data.password = await hash(password);
        }

        const maestro = await Maestro.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Contraseña actualizada correctamente',
            maestro
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar la contraseña del maestro',
            error
        });
    }
}

export const deleteMaestro = async (req, res) => {
    try {
        const { id } = req.params;
        const maestro = await Maestro.findByIdAndUpdate(id, { estado: false }, { new: true });
        const authenticatedUser = req.user;

        res.status(200).json({
            success: true,
            msg: 'Maestro desactivado correctamente',
            maestro,
            authenticatedUser
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar el maestro',
            error
        });
    }
}
