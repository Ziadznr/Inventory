const mongoose = require('mongoose');
const ReturnsProductsSchema = mongoose.Schema({
    UserEmail: { type: String },
    ReturnID: { type: mongoose.Schema.Types.ObjectId },
    ProductID: { type: mongoose.Schema.Types.ObjectId },
    Qty: { type: Number },
    UnitCost: { type: Number },
    Total: { type: Number },
    CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });
const ReturnsProductsModel = mongoose.model('returnsproducts', ReturnsProductsSchema);
module.exports = ReturnsProductsModel;