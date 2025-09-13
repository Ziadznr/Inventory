const mongoose = require("mongoose");
const CustomersProductEntryModel = require("../../models/Customers/CustomersProductEntryModel");

const CustomerProductReportService = async (req) => {
  try {
    const { FromDate, ToDate, FacultyID, DepartmentID, SectionID, CustomerID } = req.body;

    if (!FromDate || !ToDate) {
      return { status: "error", message: "FromDate and ToDate are required" };
    }

    const match = {
      PurchaseDate: {
        $gte: new Date(FromDate),
        $lte: new Date(new Date(ToDate).setHours(23, 59, 59, 999)),
      },
    };

    const isValidObjectId = (id) => id && mongoose.Types.ObjectId.isValid(id);

    if (isValidObjectId(CustomerID)) match.CustomerID = new mongoose.Types.ObjectId(CustomerID);

    // Start aggregation
    const pipeline = [{ $match: match }];

    // Lookup customer
    pipeline.push({
      $lookup: {
        from: "customers",
        localField: "CustomerID",
        foreignField: "_id",
        as: "customer",
      },
    });
    pipeline.push({ $unwind: "$customer" });

    // Filter by Faculty, Department, Section inside customer
    if (isValidObjectId(FacultyID)) {
      pipeline.push({ $match: { "customer.Faculty": new mongoose.Types.ObjectId(FacultyID) } });
    }
    if (isValidObjectId(DepartmentID)) {
      pipeline.push({ $match: { "customer.Department": new mongoose.Types.ObjectId(DepartmentID) } });
    }
    if (isValidObjectId(SectionID)) {
      pipeline.push({ $match: { "customer.Section": new mongoose.Types.ObjectId(SectionID) } });
    }

    // Unwind products
    pipeline.push({ $unwind: "$Products" });

    // Lookup product, brand, category
    pipeline.push(
      {
        $lookup: {
          from: "products",
          localField: "Products.ProductName",
          foreignField: "Name",
          as: "productDetails",
        },
      },
      { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "brands",
          localField: "productDetails.BrandID",
          foreignField: "_id",
          as: "brands",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "productDetails.CategoryID",
          foreignField: "_id",
          as: "categories",
        },
      }
    );

    // Group by purchase
    pipeline.push({
      $group: {
        _id: "$_id",
        CustomerName: { $first: "$customer.CustomerName" },
        PurchaseDate: { $first: "$PurchaseDate" },
        Total: { $first: "$Total" },
        Products: { $push: "$Products" },
        Rows: { $push: { Products: "$Products", brands: "$brands", categories: "$categories" } },
      },
    });

    // Total sum
    pipeline.push({
      $facet: {
        Total: [{ $group: { _id: null, TotalAmount: { $sum: "$Total" } } }],
        Rows: [{ $project: { CustomerName: 1, PurchaseDate: 1, Total: 1, Products: 1, Rows: 1 } }],
      },
    });

    const data = await CustomersProductEntryModel.aggregate(pipeline);

    console.log("Mongo Match Filter:", match);
    console.log("Report Data:", JSON.stringify(data, null, 2));

    return { status: "success", data };
  } catch (error) {
    console.error("CustomerProductReportService Error:", error);
    return { status: "error", message: error.message || "An error occurred" };
  }
};

module.exports = CustomerProductReportService;
