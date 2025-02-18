import { Schema, model } from "mongoose";

const AlumnoSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        maxLength: [25, 'No puede superar los 25 caracteres']
    },
    surname: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        maxLength: [25, 'No puede superar los 25 caracteres']
    },
    username: {
        type: String,
        unique: true,
        required: [true, 'El nombre de usuario es obligatorio']
    },
    email: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    profilePicture: {
        type: String,
    },
    phone: {
        type: String,
        minLength: [8, 'El número de teléfono debe tener 8 dígitos'],
        maxLength: [8, 'El número de teléfono debe tener 8 dígitos'],
        required: [true, 'El número de teléfono es obligatorio']
    },
    role: {
        type: String,
        required: true,
        enum: ['STUDENT_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    cursos: [{
        type: Schema.Types.ObjectId,
        ref: 'Curso'
    }]
},
    {
        timestamps: true,
        versionKey: false
    }
);

AlumnoSchema.methods.toJSON = function(){
    const { __v, password, _id, ...alumno } = this.toObject();
    alumno.uid = _id;
    return alumno;
}

export default model('Alumno', AlumnoSchema);
