const mongoose = require('mongoose');
const CategoriesSchema = mongoose.Schema({
    UserEmail: { type: String },    
    Name: { type: String, required: true },
    CreatedDate: { type: Date, default: Date.now() }    
},{versionKey: false });
const CategoriesModel = mongoose.model('categories', CategoriesSchema);
module.exports = CategoriesModel;