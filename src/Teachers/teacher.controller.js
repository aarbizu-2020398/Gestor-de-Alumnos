import { response, request } from "express";
import argon2 from "argon2";
import Teacher from "../Teachers/teacher.model.js";
import Course from "../Courses/course.model.js"

export const getTeachers = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, teachers] = await Promise.all([
            Teacher.countDocuments(query),
            Teacher.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            teachers
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener profesores',
            error
        });
    }
};

export const createTeacher = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        const hashedPassword = await argon2.hash(password);

        const teacher = new Teacher({ name, surname, email, password: hashedPassword, role: "TEACHER_ROLE" });

        await teacher.save();

        res.status(201).json({
            success: true,
            msg: 'Profesor creado exitosamente',
            teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al crear profesor',
            error
        });
    }
};

export const updateTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id, password, ...data } = req.body;

        if (password) {
            data.password = await bcrypt.hash(password, 10);
        }

        const teacher = await Teacher.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Profesor actualizado',
            teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar profesor',
            error
        });
    }
};

export const deleteTeacher = async (req, res) => {
    try {
        const { id } = req.params;
        const teacher = await Teacher.findByIdAndUpdate(id, { estado: false }, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Profesor desactivado',
            teacher
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar profesor',
            error
        });
    }
};

export const getTeacherCourses = async (req, res) => {
    try {
        const { id } = req.params;

        const teacher = await Teacher.findById(id);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                msg: "Profesor no encontrado"
            });
        }

        const courses = await Course.find({ teacher: id });

        res.status(200).json({
            success: true,
            msg: `Cursos impartidos por ${teacher.name} ${teacher.surname}`,
            courses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Error al obtener cursos del profesor",
            error
        });
    }
};
