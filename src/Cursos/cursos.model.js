import { Schema, model } from "mongoose";

const CursoSchema = new Schema(
    {
        nombre: {
            type: String,
            required: [true, "El nombre del curso es obligatorio"],
            maxLength: [50, "El nombre no puede superar los 50 caracteres"],
            unique: true,
            trim: true,
        },
        descripcion: {
            type: String,
            required: [true, "La descripción es obligatoria"],
            maxLength: [200, "La descripción no puede superar los 200 caracteres"],
        },
        codigo: {
            type: String,
            required: [true, "El código del curso es obligatorio"],
            unique: true,
            trim: true,
        },
        duracion: {
            type: Number,
            required: [true, "La duración en horas es obligatoria"],
            min: [1, "La duración debe ser al menos 1 hora"],
        },
        profesor: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Debe asignarse un profesor al curso"],
        },
        alumnos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Alumno",
            },
        ],
        estado: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default model("Curso", CursoSchema);
