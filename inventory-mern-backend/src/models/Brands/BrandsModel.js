const mongoose = require('mongoose');
const BrandsSchema = new mongoose.Schema({
  UserEmail: { type: String },  
  Name: {   type: String, required: true },
  CreatedDate: { type: Date, default: Date.now() }
},{versionKey: false });
const BrandsModel = mongoose.model('brands', BrandsSchema);
module.exports = BrandsModel;              