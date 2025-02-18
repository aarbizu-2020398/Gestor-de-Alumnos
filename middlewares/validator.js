import { body, param } from "express-validator";
import { validarCampos } from "../validar-campos.js";
import { existenteEmail, esRoleValido, existeAlumnoById, existeMaestroById, existeCursoById } from "../helpers/db-validator.js";


export const registerValidator = [
    body('nombre', "El nombre es obligatorio").not().isEmpty(),
    body('apellido', "El apellido es obligatorio").not().isEmpty(),
    body('email', "Debe ingresar un email válido").isEmail(),
    body('email').custom(existenteEmail),
    body("role").custom(esRoleValido),
    body('password', "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
    validarCampos
];


export const loginValidator = [
    body('email').optional().isEmail().withMessage("Ingrese un email válido"),
    body('username').optional().isString().withMessage("Ingrese un nombre de usuario válido"),
    body('password', "La contraseña debe tener al menos 8 caracteres").isLength({ min: 8 }),
    validarCampos
];


export const alumnoValidator = [
    body('nombre', "El nombre es obligatorio").not().isEmpty(),
    body('apellido', "El apellido es obligatorio").not().isEmpty(),
    body('email', "Debe ingresar un email válido").isEmail(),
    body('matricula', "La matrícula es obligatoria").not().isEmpty(),
    body('telefono', "El teléfono debe tener entre 8 y 10 dígitos").isLength({ min: 8, max: 10 }),
    validarCampos
];

export const alumnoIdValidator = [
    param('id', "ID no válido").isMongoId(),
    param('id').custom(existeAlumnoById),
    validarCampos
];


export const maestroValidator = [
    body('nombre', "El nombre es obligatorio").not().isEmpty(),
    body('apellido', "El apellido es obligatorio").not().isEmpty(),
    body('email', "Debe ingresar un email válido").isEmail(),
    body('especialidad', "La especialidad es obligatoria").not().isEmpty(),
    body('telefono', "El teléfono debe tener entre 8 y 10 dígitos").isLength({ min: 8, max: 10 }),
    validarCampos
];

export const maestroIdValidator = [
    param('id', "ID no válido").isMongoId(),
    param('id').custom(existeMaestroById),
    validarCampos
];


export const cursoValidator = [
    body('nombre', "El nombre del curso es obligatorio").not().isEmpty(),
    body('descripcion', "La descripción es obligatoria").not().isEmpty(),
    body('codigo', "El código es obligatorio").not().isEmpty(),
    body('duracion', "La duración es obligatoria y debe ser un número").isNumeric(),
    body('profesor', "El ID del profesor no es válido").isMongoId(),
    validarCampos
];

export const cursoIdValidator = [
    param('id', "ID no válido").isMongoId(),
    param('id').custom(existeCursoById),
    validarCampos
];
