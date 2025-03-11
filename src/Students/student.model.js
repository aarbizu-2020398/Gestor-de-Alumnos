import { Schema, model } from "mongoose";

const StudentSchema = new Schema({
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
        default: "STUDENT_ROLE",
        enum: ["STUDENT_ROLE"]
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

StudentSchema.methods.toJSON = function () {
    const { __v, password, _id, ...student } = this.toObject();
    student.uid = _id;
    return student;
};

export default model('Student', StudentSchema);