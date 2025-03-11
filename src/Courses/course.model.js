import { Schema, model } from "mongoose";

const CourseSchema = new Schema({
    name: {
        type: String,
        required: [true, "Course name is required"],
        unique: true
    },
    description: {
        type: String,
        required: [true, "Description is required"]
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true
    },
    students: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    estado: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    versionKey: false
});

CourseSchema.methods.toJSON = function () {
    const { __v, _id, ...course } = this.toObject();
    course.uid = _id;
    return course;
};

export default model('Course', CourseSchema);