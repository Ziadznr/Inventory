const mongoose = require('mongoose');

const ChairmanSchema = mongoose.Schema({
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "departments",   // Department Model এর সাথে relation
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    role: {
        type: String,
        default: "chairman"   // Future এ admin/teacher ইত্যাদি role রাখা যাবে
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

const ChairmanModel = mongoose.model("chairmans", ChairmanSchema);

module.exports = ChairmanModel;
