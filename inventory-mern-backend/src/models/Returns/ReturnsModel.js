const mongoose = require('mongoose');
const ReturnsSchema = mongoose.Schema({
    UserEmail: { type: String },
    CustomerID:{type:mongoose.Schema.Types.ObjectId},
    // Optional reference to a sale
    SaleID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "sales" 
    },
    // Optional reference to a customer product entry
    CustomerProductEntryID: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "customersproductentries" 
    },
    Reason: { type: String,required: true  },
    GivenDate: { type: Date, required: true }, 
    CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });
const ReturnsModel = mongoose.model('returns', ReturnsSchema);
module.exports = ReturnsModel;