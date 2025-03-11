import { Schema, model } from "mongoose";

const TeacherSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Cannot exceed 25 characters"]
    },
    surname: {
        type: String,
        required: [true, "Surname is required"],
        maxLength: [25, "Cannot exceed 25 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 8
    },
    role: {
        type: String,
        default: "TEACHER_ROLE",
        enum: ["TEACHER_ROLE"]
    },
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

TeacherSchema.methods.toJSON = function () {
    const { __v, password, _id, ...teacher } = this.toObject();
    teacher.uid = _id;
    return teacher;
};

export default model('Teacher', TeacherSchema);