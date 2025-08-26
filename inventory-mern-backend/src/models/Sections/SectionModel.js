// models/Sections/SectionModel.js
const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
    Name: { type: String, required: true, unique: true },
    UserEmail: { type: String },
    CreatedDate: { type: Date, default: Date.now }
}, { versionKey: false });

const SectionModel = mongoose.model('sections', SectionSchema);
module.exports = SectionModel;
