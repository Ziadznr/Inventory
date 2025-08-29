const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
    UserEmail: { type: String },
    CategoryID: { type: mongoose.Schema.Types.ObjectId, ref: "categories" },
    BrandID: { type: mongoose.Schema.Types.ObjectId, ref: "brands" },
    Name: { type: String },
    Details: { type: String },
    Stock: { type: Number, default: 0 },   // ✅ track available stock
    CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });

const ProductsModel = mongoose.model('products', ProductsSchema);
module.exports = ProductsModel;
