const mongoose = require('mongoose');
const SalesSchema = mongoose.Schema({
    UserEmail: { type: String },
    CustomerID:{type:mongoose.Schema.Types.ObjectId},
    OtherCost:{ type: Number },
    GrandTotal:{ type: Number },
    Note: { type: String },
    CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });
const SalesModel = mongoose.model('sales', SalesSchema);
module.exports = SalesModel;