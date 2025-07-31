const mongoose = require('mongoose');
const CustomersSchema = mongoose.Schema({
    UserEmail: { type: String },
    Name: { type: String, required: true },
    Address: { type: String },
    Phone: { type: String, required: true },
    Email: { type: String },
    CreatedDate: { type: Date, default: Date.now() }
},{versionKey: false });
const SuppliersModel = mongoose.model('suppliers', CustomersSchema);
module.exports = SuppliersModel;