const ParentModel = require('../../models/Sales/SalesModel');
const ChildsModel = require('../../models/Sales/SalesProductsModel');
const CreateParentChildsService = require('../../services/common/CreateParentChildsService');
const ListOneJoinService = require('../../services/common/ListOneJoinService');
const DeleteParentChildsService = require('../../services/common/DeleteParentChildsService');
const SalesReportService = require('../../services/report/SalesReportService');
const SalesSummeryService = require('../../services/summery/SalesSummeryService');
const SendEmailUtility = require('../../utility/SendEmailUtility');
const CustomersModel = require('../../models/Customers/CustomersModel'); // ✅ import email utility

exports.CreateSales = async (req, res) => {
  try {
    // 1️⃣ Create sale and child products
    const Result = await CreateParentChildsService(req, ParentModel, ChildsModel, 'SaleID');
    console.log("✅ Sale created:", Result);

    // 2️⃣ Fetch customer using the ID inside Parent
    const CustomerID = req.body?.Parent?.CustomerID;
    if (!CustomerID) {
      console.warn("⚠️ CustomerID not provided in request body");
    }

    const CustomerData = CustomerID
      ? await CustomersModel.findById(CustomerID).lean()
      : null;

    console.log("📌 Fetched customer data:", CustomerData);

    // 3️⃣ Send email if email exists
    if (CustomerData?.CustomerEmail) {
      const EmailTo = CustomerData.CustomerEmail;
      const EmailSubject = '📢 New Sale Created - Notification';
      const EmailText = `
Hello ${CustomerData.CustomerName || "Customer"},

Your purchase has been successfully recorded.

💰 Grand Total: $${req.body?.Parent?.GrandTotal || 0}
🗓 Date: ${new Date().toLocaleDateString()}

Thank you for your business!
      `;

      console.log("📧 Sending email to:", EmailTo);
      await SendEmailUtility(EmailTo, EmailText, EmailSubject);
      console.log("✅ Email sent successfully!");
    } else {
      console.warn("⚠️ Customer email not found, skipping email.");
    }

    res.status(200).json(Result);
  } catch (error) {
    console.error("CreateSales Error:", error);
    res.status(500).json({ status: "error", message: error.toString() });
  }
};
// ------------------ Other functions remain unchanged ------------------

exports.SalesList = async (req, res) => {
  try {
    const searchKeyword = req.params.searchKeyword || "";
    const SearchRgx = { $regex: searchKeyword, $options: "i" };

    // Lookup stages...
    const JoinCustomer = { $lookup: { from: "customers", localField: "CustomerID", foreignField: "_id", as: "customers" } };
    const JoinFaculty = { $lookup: { from: "faculties", localField: "customers.Faculty", foreignField: "_id", as: "faculty" } };
    const JoinDepartment = { $lookup: { from: "departments", localField: "customers.Department", foreignField: "_id", as: "department" } };
    const JoinSection = { $lookup: { from: "sections", localField: "customers.Section", foreignField: "_id", as: "section" } };
    const JoinSalesProducts = { $lookup: { from: "salesproducts", localField: "_id", foreignField: "SaleID", as: "salesProducts" } };
    const UnwindProducts = { $unwind: { path: "$salesProducts", preserveNullAndEmptyArrays: true } };
    const JoinProducts = { $lookup: { from: "products", localField: "salesProducts.ProductID", foreignField: "_id", as: "productDetails" } };
    const UnwindProductDetails = { $unwind: { path: "$productDetails", preserveNullAndEmptyArrays: true } };

    const MatchStage = { $match: { $or: [
      { Note: SearchRgx },
      { "customers.CustomerName": SearchRgx },
      { "customers.Phone": SearchRgx },
      { "customers.CustomerEmail": SearchRgx }
    ] } };

    const GroupStage = {
      $group: {
        _id: "$_id",
        UserEmail: { $first: "$UserEmail" },
        CustomerID: { $first: "$CustomerID" },
        OtherCost: { $first: "$OtherCost" },
        GrandTotal: { $first: "$GrandTotal" },
        Note: { $first: "$Note" },
        CreatedDate: { $first: "$CreatedDate" },
        customers: { $first: "$customers" },
        faculty: { $first: "$faculty" },
        department: { $first: "$department" },
        section: { $first: "$section" },
        Products: {
          $push: {
            ProductName: "$productDetails.Name",
            Qty: "$salesProducts.Qty",
            UnitCost: "$salesProducts.UnitCost",
            Total: "$salesProducts.Total"
          }
        }
      }
    };

    const Result = await ParentModel.aggregate([
      JoinCustomer, JoinFaculty, JoinDepartment, JoinSection,
      JoinSalesProducts, UnwindProducts, JoinProducts, UnwindProductDetails,
      MatchStage, GroupStage, { $sort: { CreatedDate: -1 } }
    ]);

    const Data = Result.map(sale => {
      const customer = sale.customers?.[0] || {};
      return {
        _id: sale._id,
        OtherCost: sale.OtherCost,
        GrandTotal: sale.GrandTotal,
        Note: sale.Note,
        CreatedDate: sale.CreatedDate,
        CustomerData: {
          CustomerName: customer.CustomerName || "-",
          Category: customer.Category || "-",
          FacultyName: sale.faculty?.[0]?.Name || "-",
          DepartmentName: sale.department?.[0]?.Name || "-",
          SectionName: sale.section?.[0]?.Name || "-",
          Email: customer.CustomerEmail || "-",
          Phone: customer.Phone || "-"
        },
        Products: sale.Products.filter(p => p.ProductName)
      };
    });

    res.status(200).json({ status: "success", data: Data });
  } catch (error) {
    console.error("SalesList Error:", error);
    res.status(500).json({ status: "error", message: error.toString() });
  }
};

exports.SalesDelete = async (req, res) => {
    let Result = await DeleteParentChildsService(req, ParentModel, ChildsModel, 'SaleID');
    res.status(200).json(Result);
}

exports.SalesByDate = async (req, res) => {
    let Result = await SalesReportService(req);
    res.status(200).json(Result);
}

exports.SaleSummery= async (req, res) => {
    let Result = await SalesSummeryService(req);
    res.status(200).json(Result);
}
