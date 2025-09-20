const mongoose = require('mongoose');
const ReturnsProductsSchema = mongoose.Schema({
  UserEmail: { type: String },
  ReturnID: { type: mongoose.Schema.Types.ObjectId },
  ProductID: { type: mongoose.Schema.Types.ObjectId },  // 🔹 new
  Source: { type: String, enum: ["sale", "customerEntry"] }, // 🔹 new
  ProductName: { type: String, required: true },
  Qty: { type: Number },
  Available: { type: Number, default: 0 },
  CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });

const ReturnsProductsModel = mongoose.model('returnsproducts', ReturnsProductsSchema);
module.exports = ReturnsProductsModel;