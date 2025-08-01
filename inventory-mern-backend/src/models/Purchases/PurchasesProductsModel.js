const mongoose = require('mongoose');
const PurchasesProductsSchema = mongoose.Schema({
    UserEmail: { type: String },
    PurchaseID: { type: mongoose.Schema.Types.ObjectId },
    ProductID: { type: mongoose.Schema.Types.ObjectId },
    Qty: { type: Number },
    UnitCost: { type: Number },
    Total: { type: Number },
    CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });
const PurchasesProductsModel = mongoose.model('purchasesproducts', PurchasesProductsSchema);
module.exports = PurchasesProductsModel;