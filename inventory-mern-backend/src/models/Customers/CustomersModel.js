const mongoose = require('mongoose');
const CustomersSchema = mongoose.Schema({
    UserEmail: { type: String },
    CustomerName: { type: String },
    Phone: { type: String, required: true },
    Email: { type: String },
    Address: { type: String  },
    CreatedDate: { type: Date, default: Date.now() }
},{versionKey: false });
const CustomersModel = mongoose.model('customers', CustomersSchema);
module.exports = CustomersModel;