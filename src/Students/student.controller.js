import { response, request } from "express";
import argon2  from "argon2";
import Student from '../Students/student.model.js';
import Course from '../Courses/course.model.js';

export const getStudents = async (req = request, res = response) => {
    try {
        const { limite = 10, desde = 0 } = req.query;
        const query = { estado: true };

        const [total, students] = await Promise.all([
            Student.countDocuments(query),
            Student.find(query)
                .skip(Number(desde))
                .limit(Number(limite))
        ]);

        res.status(200).json({
            success: true,
            total,
            students
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener estudiantes',
            error
        });
    }
};

export const createStudent = async (req, res) => {
    try {
        const { name, surname, email, password } = req.body;

        const hashedPassword = await argon2.hash(password);

        const student = new Student({ name, surname, email, password: hashedPassword, role: "STUDENT_ROLE" });

        await student.save();

        res.status(201).json({
            success: true,
            msg: 'Estudiante creado exitosamente',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al crear estudiante',
            error
        });
    }
};

export const assignCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const { courseId } = req.body;

        const student = await Student.findById(id);
        const course = await Course.findById(courseId);

        if (!student || !course) {
            return res.status(404).json({
                success: false,
                msg: 'Estudiante o curso no encontrado'
            });
        }

        if (student.courses.length >= 3) {
            return res.status(400).json({
                success: false,
                msg: 'El estudiante ya tiene 3 cursos asignados'
            });
        }

        if (student.courses.includes(courseId)) {
            return res.status(400).json({
                success: false,
                msg: 'El estudiante ya está asignado a este curso'
            });
        }

        student.courses.push(courseId);
        await student.save();

        res.status(200).json({
            success: true,
            msg: 'Curso asignado exitosamente',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al asignar curso',
            error
        });
    }
};

export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, newPassword, ...data } = req.body;

        if (password && newPassword) {
 
            const student = await Student.findById(id);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    msg: 'Estudiante no encontrado'
                });
            }

            const passwordMatch = await argon2.verify(student.password, password);

            if (!passwordMatch) {
                return res.status(400).json({
                    success: false,
                    msg: 'La contraseña actual es incorrecta'
                });
            }

            data.password = await argon2.hash(newPassword);
        }

        const student = await Student.findByIdAndUpdate(id, data, { new: true });

        res.status(200).json({
            success: true,
            msg: 'Estudiante actualizado exitosamente',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al actualizar el perfil del estudiante',
            error
        });
    }
};

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        if (id !== req.usuario._id.toString()) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para eliminar este perfil, solo el mismo estudiante lo puede eliminar"
            });
        }

        const student = await Student.findByIdAndUpdate(id, { estado: false }, { new: true });

        if (!student) {
            return res.status(404).json({
                success: false,
                msg: "Estudiante no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Estudiante desactivado',
            student
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al desactivar estudiante',
            error
        });
    }
};

export const getStudentCourses = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findById(id).populate('courses', 'name description');

        if (!student) {
            return res.status(404).json({
                success: false,
                msg: 'Estudiante no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            msg: 'Cursos del estudiante obtenidos correctamente',
            courses: student.courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: 'Error al obtener los cursos del estudiante',
            error
        });
    }
};