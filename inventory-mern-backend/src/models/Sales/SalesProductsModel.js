const mongoose = require('mongoose');

const SalesProductsSchema = mongoose.Schema({
    UserEmail: { type: String },
    SaleID: { type: mongoose.Schema.Types.ObjectId },
    ProductID: { type: mongoose.Schema.Types.ObjectId },
    Qty: { type: Number },            // Original sold quantity
    AvailableQty: { type: Number },   // Real-time available quantity for returns
    UnitCost: { type: Number },
    Total: { type: Number },
    CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });

const SalesProductsModel = mongoose.model('salesproducts', SalesProductsSchema);

module.exports = SalesProductsModel;
