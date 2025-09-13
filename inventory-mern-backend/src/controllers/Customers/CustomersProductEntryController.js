const mongoose = require("mongoose");
const CustomersModel = require("../../models/Customers/CustomersModel");
const CustomersProductEntryModel = require("../../models/Customers/CustomersProductEntryModel");
const CustomerProductReportService = require("../../services/report/CustomerProductReportService");

// ---------------- CREATE ENTRY ----------------
exports.CreateCustomerProductEntry = async (req, res) => {
  try {
    const { CustomerID, Items, PurchaseAddress, PayslipNumber, PurchaseDate } = req.body;

    if (!Items || !Array.isArray(Items) || Items.length === 0)
      return res.status(400).json({ status: "fail", message: "At least 1 product is required" });

    const customer = await CustomersModel.findById(CustomerID).lean();
    if (!customer) return res.status(404).json({ status: "fail", message: "Customer not found" });

    const Total = Items.reduce((acc, item) => acc + Number(item.Total || 0), 0);

    const Products = Items.map(item => ({
      ProductName: item.ProductName,
      Qty: item.Qty,
      UnitPrice: item.UnitCost,
      Total: item.Total
    }));

    const newEntry = new CustomersProductEntryModel({
      CustomerID,
      Products,
      PurchaseAddress,
      PayslipNumber,
      Total,
      PurchaseDate,
    });

    await newEntry.save();

    res.status(201).json({ status: "success", message: "Customer product entry created successfully", data: newEntry });
  } catch (error) {
    console.error("CreateCustomerProductEntry Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};


// ---------------- LIST ENTRIES ----------------
exports.CustomerProductEntryList = async (req, res) => {
  try {
    const { category, facultyId, departmentId, sectionId, searchKeyword } = req.query;
    const SearchRgx = { $regex: searchKeyword || "", $options: "i" };

    const pipeline = [
      {
        $lookup: {
          from: "customers",
          localField: "CustomerID",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" },

      // 🔹 Lookup faculty, department, section
      {
        $lookup: {
          from: "faculties",
          localField: "customer.Faculty",
          foreignField: "_id",
          as: "faculty",
        },
      },
      {
        $lookup: {
          from: "departments",
          localField: "customer.Department",
          foreignField: "_id",
          as: "department",
        },
      },
      {
        $lookup: {
          from: "sections",
          localField: "customer.Section",
          foreignField: "_id",
          as: "section",
        },
      },
    ];

    // 🔹 Build match conditions
    const matchConditions = [];

    if (category) matchConditions.push({ "customer.Category": category });
    if (facultyId) matchConditions.push({ "customer.Faculty": new mongoose.Types.ObjectId(facultyId) });
    if (departmentId) matchConditions.push({ "customer.Department": new mongoose.Types.ObjectId(departmentId) });
    if (sectionId) matchConditions.push({ "customer.Section": new mongoose.Types.ObjectId(sectionId) });
    if (searchKeyword) {
      matchConditions.push({
        $or: [
          { "customer.CustomerName": SearchRgx },
          { "customer.CustomerEmail": SearchRgx },
          { "customer.Phone": SearchRgx },
          { PayslipNumber: SearchRgx },
          { Products: SearchRgx },
        ],
      });
    }

    if (matchConditions.length > 0) {
      pipeline.push({ $match: { $and: matchConditions } });
    }

    pipeline.push({ $sort: { CreatedDate: -1 } });

    const Result = await CustomersProductEntryModel.aggregate(pipeline);

    // 🔹 Map output
    const Data = Result.map((entry) => ({
      _id: entry._id,
      CustomerName: entry.customer.CustomerName || "-",
      Category: entry.customer.Category || "-",
      FacultyName: entry.faculty?.[0]?.Name || "-",
      DepartmentName: entry.department?.[0]?.Name || "-",
      SectionName: entry.section?.[0]?.Name || "-",
      Email: entry.customer.CustomerEmail || "-",
      Phone: entry.customer.Phone || "-",
      PayslipNumber: entry.PayslipNumber,
      Products: entry.Products,
      Quantity: entry.Quantity,
      Price: entry.Price,
      Total: entry.Total,
      PurchaseAddress: entry.PurchaseAddress,
      PurchaseDate: entry.PurchaseDate,
      CreatedDate: entry.CreatedDate,
    }));

    res.status(200).json({ status: "success", data: Data });
  } catch (error) {
    console.error("CustomerProductEntryList Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------------- DELETE ENTRY ----------------
exports.DeleteCustomerProductEntry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CustomersProductEntryModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ status: "fail", message: "Entry not found" });
    }

    res.status(200).json({ status: "success", message: "Entry deleted successfully" });
  } catch (error) {
    console.error("DeleteCustomerProductEntry Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.CustomerProductReport = async (req, res) => {
    let Result = await CustomerProductReportService(req);
    res.status(200).json(Result);
}
