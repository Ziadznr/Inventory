// models/Faculties/FacultyModel.js
const mongoose = require('mongoose');

const FacultySchema = new mongoose.Schema({
    Name: { type: String, required: true, unique: true },
    UserEmail: { type: String },
    CreatedDate: { type: Date, default: Date.now }
}, { versionKey: false });

const FacultyModel = mongoose.model('faculties', FacultySchema);
module.exports = FacultyModel;
