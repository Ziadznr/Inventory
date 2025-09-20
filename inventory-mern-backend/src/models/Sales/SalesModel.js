const mongoose = require('mongoose');

// 🔹 Helper function to generate 10 random digits
function generateSlipNo() {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString(); 
  // always 10 digits
}

const SalesSchema = mongoose.Schema({
  UserEmail: { type: String },
  CustomerID: { type: mongoose.Schema.Types.ObjectId, ref: "customers" },
  SlipNo: { type: String, unique: true }, // generated in pre-save
  OtherCost: { type: Number },
  GrandTotal: { type: Number },
  Note: { type: String },
  CreatedDate: { type: Date, default: Date.now }
}, { versionKey: false });

// 🔹 Pre-save hook to ensure unique SlipNo with "CS" prefix
SalesSchema.pre("save", async function (next) {
  if (!this.SlipNo) {
    let slipNo;
    let exists = true;

    while (exists) {
      // Generate slip with CS prefix
      slipNo = `CS-${generateSlipNo()}`;
      const existing = await mongoose.model("sales").findOne({ SlipNo: slipNo });
      if (!existing) {
        exists = false;
      }
    }

    this.SlipNo = slipNo;
  } else if (!this.SlipNo.startsWith("CS")) {
    // Ensure any manually set SlipNo always has CS prefix
    this.SlipNo = `CS${this.SlipNo}`;
  }
  next();
});

const SalesModel = mongoose.model("sales", SalesSchema);
module.exports = SalesModel;
