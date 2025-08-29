
const mongoose = require('mongoose');

const DepartmentSchema = new mongoose.Schema({
    Name: { type: String, required: true, unique: true },
    FacultyID: { type: mongoose.Schema.Types.ObjectId, ref: "faculties", required: true },
    UserEmail: { type: String },
    CreatedDate: { type: Date, default: Date.now }
}, { versionKey: false });

const DepartmentModel = mongoose.model('departments', DepartmentSchema);
module.exports = DepartmentModel;

