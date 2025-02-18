import { Router } from "express";
import { check } from "express-validator";
import {getMaestros, getMaestroById,registerMaestro,updateMaestro,updatePasswordMaestro,deleteMaestro} from "../Maestros/maestros.controller.js";
import { existeMaestroById } from "../helpers/db-validator.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRol } from "../middlewares/validar-roles.js";
import { uploadProfilePicture } from "../middlewares/multer-upload.js";

const router = Router();

router.get("/", validarJWT, getMaestros);


router.get(
    "/:id",
    [
        validarJWT,
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeMaestroById),
        validarCampos,
    ],
    getMaestroById
);


router.post(
    "/",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("nombre", "El nombre es obligatorio").not().isEmpty(),
        check("apellido", "El apellido es obligatorio").not().isEmpty(),
        check("email", "El correo no es válido").isEmail(),
        check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        check("telefono", "El teléfono debe tener entre 8 y 10 dígitos").isLength({ min: 8, max: 10 }),
        check("especialidad", "La especialidad es obligatoria").not().isEmpty(),
        validarCampos,
    ],
    registerMaestro
);


router.put(
    "/:id",
    uploadProfilePicture.single("profilePicture"),
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeMaestroById),
        validarCampos,
    ],
    updateMaestro
);


router.put(
    "/updatePassword/:id",
    [
        validarJWT,
        check("id", "ID no válido").isMongoId(),
        check("password", "La contraseña debe tener al menos 6 caracteres").isLength({ min: 6 }),
        validarCampos,
    ],
    updatePasswordMaestro
);


router.delete(
    "/:id",
    [
        validarJWT,
        tieneRol("ADMIN_ROLE"),
        check("id", "ID no válido").isMongoId(),
        check("id").custom(existeMaestroById),
        validarCampos,
    ],
    deleteMaestro
);

export default router;
