const mongoose = require('mongoose');
const ExpenseTypesSchema = mongoose.Schema({
    UserEmail: { type: String },
    Name: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });
const ExpenseTypesModel = mongoose.model('expensetypes', ExpenseTypesSchema);
module.exports = ExpenseTypesModel;