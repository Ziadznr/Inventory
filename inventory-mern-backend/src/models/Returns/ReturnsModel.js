const mongoose = require('mongoose');
const ReturnsSchema = mongoose.Schema({
    UserEmail: { type: String },
    CustomerID:{type:mongoose.Schema.Types.ObjectId},
    Reason: { type: String,required: true  },
    GivenDate: { type: Date, required: true }, 
    CreatedDate: { type: Date, default: Date.now() }
}, { versionKey: false });
const ReturnsModel = mongoose.model('returns', ReturnsSchema);
module.exports = ReturnsModel;