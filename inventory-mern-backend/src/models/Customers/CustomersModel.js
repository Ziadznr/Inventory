const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CustomersSchema = mongoose.Schema({
    CustomerName: { type: String, required: true },
    Phone: { type: String, required: true },

    // Login credentials
    CustomerEmail: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address']
    },
    Password: { type: String, required: true },  // 🔑 Added password

    // Optional profile photo (like admin)
    Photo: { type: String, default: "" },

    // Role / category (defines relationship)
    Category: { 
        type: String, 
        enum: ["Dean", "Teacher", "Chairman", "Officer"], 
        required: true 
    },

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

// 🔒 Hash password before saving
// CustomersSchema.pre("save", async function (next) {
//     if (!this.isModified("Password")) return next();
//     this.Password = await bcrypt.hash(this.Password, 10);
//     next();
// });

const CustomersModel = mongoose.model("customers", CustomersSchema);
module.exports = CustomersModel;
