import { Schema, model } from "mongoose";

const MaestroSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      maxLength: [50, "El nombre no puede superar los 50 caracteres"],
      trim: true,
    },
    apellido: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      maxLength: [50, "El apellido no puede superar los 50 caracteres"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "El correo es obligatorio"],
      unique: true,
      match: [/.+@.+\..+/, "Por favor, ingrese un correo válido"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    telefono: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      minLength: [8, "El teléfono debe tener al menos 8 dígitos"],
      maxLength: [10, "El teléfono no puede superar los 10 dígitos"],
    },
    especialidad: {
      type: String,
      required: [true, "La especialidad es obligatoria"],
      maxLength: [100, "La especialidad no puede superar los 100 caracteres"],
    },
    role: {
      type: String,
      default: "TEACHER_ROLE",
      enum: ["TEACHER_ROLE"],
    },
    perfil: {
      type: String,
      default: null,
    },
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

MaestroSchema.methods.toJSON = function () {
  const { __v, password, _id, ...maestro } = this.toObject();
  maestro.uid = _id;
  return maestro;
};

export default model("Maestro", MaestroSchema);
