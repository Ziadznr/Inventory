const mongoose = require("mongoose");

// Sub-schema for individual product items
const ProductItemSchema = new mongoose.Schema({
  ProductName: { type: String, required: true },
  Qty: { type: Number, required: true },
  UnitPrice: { type: Number, required: true },
  Total: { type: Number, required: true }
}, { _id: false });

const CustomersProductEntrySchema = new mongoose.Schema(
  {
    CustomerID: { type: mongoose.Schema.Types.ObjectId, ref: "customers", required: true },
    Products: { type: [ProductItemSchema], required: true }, // ✅ array of products
    PurchaseAddress: { type: String, required: true },
    PayslipNumber: { type: String, required: true, unique: true },
    Total: { type: Number, required: true }, // total of all products
    PurchaseDate: { type: Date, required: true },
    CreatedDate: { type: Date, default: Date.now }
  },
  { versionKey: false }
);

const CustomersProductEntryModel = mongoose.model("customersproductentries", CustomersProductEntrySchema);
module.exports = CustomersProductEntryModel;
