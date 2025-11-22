const mongoose = require("mongoose");
const CustomersModel = require("../../models/Customers/CustomersModel");
const CustomersProductEntryModel = require("../../models/Customers/CustomersProductEntryModel");
const CustomerProductReportService = require("../../services/report/CustomerProductReportService");
const ReturnsProductsModel = require("../../models/Returns/ReturnsProductsModel"); // 🔹 Import returns model
const SendEmailUtility = require("../../utility/SendEmailUtility");


// ---------------- CREATE ENTRY ----------------
exports.CreateCustomerProductEntry = async (req, res) => {
  try {
    const { CustomerID, Items, PurchaseAddress, PayslipNumber, PurchaseDate } = req.body;

    if (!Items || !Array.isArray(Items) || Items.length === 0) {
      return res.status(400).json({ status: "fail", message: "At least 1 product is required" });
    }

    const customer = await CustomersModel.findById(CustomerID).lean();
    if (!customer) {
      return res.status(404).json({ status: "fail", message: "Customer not found" });
    }

    const Total = Items.reduce((acc, item) => acc + Number(item.Total || 0), 0);

    const Products = Items.map(item => ({
      ProductName: item.ProductName,
      Qty: item.Qty,
      AvailableQty: item.Qty,
      UnitPrice: item.UnitCost,
      Total: item.Total,
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

    // -----------------------------------------------------
    // ✅ SEND EMAIL TO CUSTOMER AFTER SUCCESSFUL CREATION
    // -----------------------------------------------------
    try {
      const emailText = `
Dear ${customer.CustomerName},

Your purchase entry has been recorded successfully.

Payslip Number : ${PayslipNumber}
Total Amount   : ${Total}
Purchase Date  : ${PurchaseDate}
Address        : ${PurchaseAddress}

Thank you for your purchase.

Inventory Management System
`;

      await SendEmailUtility(
        customer.CustomerEmail,
        emailText,
        "Purchase Entry Confirmation",
        [] // no attachments
      );
    } catch (err) {
      console.error("Failed to send email:", err);
      // Email failure does NOT stop main response
    }

    // -----------------------------------------------------

    res.status(201).json({
      status: "success",
      message: "Customer product entry created successfully",
      data: newEntry
    });

  } catch (error) {
    console.error("CreateCustomerProductEntry Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------------- LIST ENTRIES WITH AVAILABLE QTY ----------------
exports.CustomerProductEntryList = async (req, res) => {
  try {
    const pageNo = Number(req.params.pageNo) || 1;
    const perPage = Number(req.params.perPage) || 10;
    const searchKeyword = req.params.searchKeyword === "0" ? "" : req.params.searchKeyword;
    const SearchRgx = { $regex: searchKeyword, $options: "i" };

    const { category, facultyId, departmentId, sectionId } = req.query;

    const pipeline = [
      {
        $lookup: {
          from: "customers",
          localField: "CustomerID",
          foreignField: "_id",
          as: "customer"
        }
      },
      { $unwind: "$customer" },
      { $lookup: { from: "faculties", localField: "customer.Faculty", foreignField: "_id", as: "faculty" } },
      { $lookup: { from: "departments", localField: "customer.Department", foreignField: "_id", as: "department" } },
      { $lookup: { from: "sections", localField: "customer.Section", foreignField: "_id", as: "section" } },
    ];

    const matchConditions = [];

    // 🔹 If logged in as Customer → restrict by email
    if (req.user?.role === "Customer") {
      matchConditions.push({ "customer.CustomerEmail": req.user.email });
    } else {
      // 🔹 Admin filters
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
            { "Products.ProductName": SearchRgx },
          ],
        });
      }
    }

    if (matchConditions.length > 0) {
      pipeline.push({ $match: { $and: matchConditions } });
    }

    // Count total
    const countPipeline = [...pipeline, { $count: "total" }];
    const totalResult = await CustomersProductEntryModel.aggregate(countPipeline);
    const total = totalResult.length > 0 ? totalResult[0].total : 0;

    // Sorting + pagination
    pipeline.push({ $sort: { CreatedDate: -1 } });
    pipeline.push({ $skip: (pageNo - 1) * perPage });
    pipeline.push({ $limit: perPage });

    const Result = await CustomersProductEntryModel.aggregate(pipeline);

    // Format output with AvailableQty updated after returns
    const Data = await Promise.all(
      Result.map(async (entry) => {
        const updatedProducts = await Promise.all(
          entry.Products.map(async (p) => {
            const returned = await ReturnsProductsModel.aggregate([
              { $match: { CustomerProductEntryID: entry._id, ProductName: p.ProductName } },
              { $group: { _id: null, totalReturned: { $sum: "$Qty" } } },
            ]);
            const totalReturned = returned[0]?.totalReturned || 0;

            return {
              ProductName: p.ProductName,
              Qty: p.Qty,
              UnitPrice: p.UnitPrice,
              Total: p.Total,
              AvailableQty: Math.max((p.AvailableQty ?? p.Qty) - totalReturned, 0),
            };
          })
        );

        return {
          _id: entry._id,
          CustomerName: entry.customer.CustomerName || "-",
          Category: entry.customer.Category || "-",
          FacultyName: entry.faculty?.[0]?.Name || "-",
          DepartmentName: entry.department?.[0]?.Name || "-",
          SectionName: entry.section?.[0]?.Name || "-",
          Email: entry.customer.CustomerEmail || "-",
          Phone: entry.customer.Phone || "-",
          PayslipNumber: entry.PayslipNumber,
          Products: updatedProducts,
          Total: entry.Total,
          PurchaseAddress: entry.PurchaseAddress,
          PurchaseDate: entry.PurchaseDate,
          CreatedDate: entry.CreatedDate,
        };
      })
    );

    res.status(200).json({ status: "success", data: Data, total, pageNo, perPage });
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
    if (!deleted) return res.status(404).json({ status: "fail", message: "Entry not found" });

    res.status(200).json({ status: "success", message: "Entry deleted successfully" });
  } catch (error) {
    console.error("DeleteCustomerProductEntry Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// ---------------- REPORT ----------------
exports.CustomerProductReport = async (req, res) => {
  try {
    const Result = await CustomerProductReportService(req);
    res.status(200).json(Result);
  } catch (error) {
    console.error("CustomerProductReport Error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};
