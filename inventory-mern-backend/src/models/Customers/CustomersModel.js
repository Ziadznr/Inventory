const mongoose = require('mongoose');

const CustomersSchema = mongoose.Schema({
    CustomerName: { type: String, required: true },
    Phone: { type: String, required: true },
    UserEmail: { type: String },
    CustomerEmail: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'] 
    },

    // Role of customer
    Category: { 
        type: String, 
        enum: ["Dean", "Teacher", "Chairman", "Officer"], 
        required: true 
    },

    // Relationships (depend on category)
    Faculty: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "faculties", 
        default: null 
    },
    Department: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "departments", 
        default: null 
    },
    Section: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "sections", 
        default: null 
    },

    CreatedDate: { type: Date, default: Date.now }
}, { versionKey: false });

const CustomersModel = mongoose.model('customers', CustomersSchema);
module.exports = CustomersModel;
