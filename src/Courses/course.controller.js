import { response, request } from "express";
import Course from '../Courses/course.model.js';
import Teacher from '../Teachers/teacher.model.js';
import Student from '../Students/student.model.js';

export const getCourses = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, courses] = await Promise.all([
            Course.countDocuments(query),
            Course.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener cursos',
            error
        });
    }
};

export const createCourse = async (req, res) => {
    try {
        const { name, description, teacherId } = req.body;

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({
                success: false,
                msg: 'Profesor no encontrado'
            });
        }

        const course = new Course({ name, description, teacher: teacherId });

        await course.save();

        res.status(201).json({
            success: true,
            msg: 'Curso creado exitosamente',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al crear curso',
            error
        });
    }
};

export const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, teacherId } = req.body;

        if (teacherId) {
            const teacher = await Teacher.findById(teacherId);
            if (!teacher) {
                return res.status(404).json({
                    success: false,
                    msg: 'Profesor no encontrado'
                });
            }
        }

        const course = await Course.findByIdAndUpdate(id, { name, description , teacher: teacherId}, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Curso actualizado',
            course
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar curso',
            error
        });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;

        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({
                success: false,
                msg: 'Curso no encontrado'
            });
        }

        course.estado = false;
        await course.save();

        await Student.updateMany(
            { courses: id }, 
            { $pull: { courses: id } } 
        );

        res.status(200).json({
            success: true,
            msg: 'Curso desactivado y estudiantes desasignados correctamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar curso',
            error
        });
    }
};