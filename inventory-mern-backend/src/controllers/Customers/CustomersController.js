const mongoose = require("mongoose");
const fs = require("fs");
const CustomersModel = require("../../models/Customers/CustomersModel");
const ListService = require("./CustomerService");
const DropDownService = require("../../services/Customer/DropdownService");
const DeleteService = require("../../services/common/DeleteService");
const CheckAssociationService = require("../../services/common/CheckAssociateService");
const SalesModel = require("../../models/Sales/SalesModel");
const DetailsByIDService = require("../../services/common/DetailsByIDService");
const SendEmailUtility = require("../../utility/SendEmailUtility");

// ------------------ List Customers with search & category ------------------
exports.CustomersList = async (req, res) => {
  try {
    const searchKeyword = req.params.searchKeyword || "0";
    const category = req.params.category || "All";

    const SearchRgx = { $regex: searchKeyword, $options: "i" };
    const SearchArray = [
      { CustomerName: SearchRgx },
      { Phone: SearchRgx },
      { CustomerEmail: SearchRgx },
      { UserEmail: SearchRgx }
    ];

    // Filter by category if not "All"
    let MatchQuery = {};
    if (category !== "All") {
      MatchQuery.Category = category;
    }

    // Set user role & email for ListService
    // Assuming you have auth middleware setting req.user
    if (req.user) {
      req.userRole = req.user.Category || "Customer";
      req.userEmail = req.user.CustomerEmail;
    }

    const Result = await ListService(req, CustomersModel, SearchArray, MatchQuery);
    return res.status(200).json(Result);
  } catch (error) {
    console.error("CustomersList Error:", error);
    return res.status(500).json({ status: "fail", data: error.toString() });
  }
};


// ------------------ Customer Dropdown ------------------
exports.CustomersDropdown = async (req, res) => {
  try {
    // Optionally pass userRole in query or decode from token
    const userRole = req.query.userRole || "Customer";

    const Result = await DropDownService(
      req,
      CustomersModel,
      { _id: 1, CustomerName: 1, Category: 1, Faculty: 1, Department: 1, Section: 1 }
    );

    return res.status(200).json(Result);
  } catch (error) {
    console.error("CustomersDropdown Error:", error);
    return res.status(500).json({ status: "fail", data: error.toString() });
  }
};


// ------------------ Customer Details by ID ------------------
exports.CustomersDetailsByID = async (req, res) => {
  try {
    const Result = await DetailsByIDService(req, CustomersModel);
    return res.status(200).json(Result);
  } catch (error) {
    console.error("CustomersDetailsByID Error:", error);
    return res.status(500).json({ status: "fail", data: error.toString() });
  }
};


// ------------------ Delete Customer with Sales association check ------------------
exports.DeleteCustomer = async (req, res) => {
  try {
    const DeleteID = req.params.id;

    // Check if customer is associated with Sales
    const CheckAssociate = await CheckAssociationService(
      { CustomerID: new mongoose.Types.ObjectId(DeleteID) },
      SalesModel
    );

    if (CheckAssociate) {
      return res.status(200).json({
        status: "associate",
        data: "This Customer is associated with Sales, cannot be deleted."
      });
    }

    // ✅ Actually delete the customer
    const deletedCustomer = await CustomersModel.findByIdAndDelete(DeleteID);

    if (!deletedCustomer) {
      return res.status(404).json({
        status: "fail",
        data: "Customer not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: "Customer deleted successfully"
    });

  } catch (err) {
    console.error("DeleteCustomer error:", err);
    return res.status(500).json({
      status: "error",
      data: "Internal server error"
    });
  }
};


// ------------------ Send Email to a Customer ------------------
exports.SendEmailToCustomer = async (req, res) => {
  try {
    const { customerId, subject, message } = req.body;
    const files = req.files || [];

    const customer = await CustomersModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ status: "fail", message: "Customer not found" });
    }

    if (!customer.CustomerEmail) {
      return res.status(400).json({ status: "fail", message: "Customer email not available" });
    }

    const attachments = files.map(file => ({
      filename: file.originalname,
      path: file.path
    }));

    await SendEmailUtility(
      customer.CustomerEmail,
      message,
      subject,
      attachments
    );

    // Delete uploaded temp files
    files.forEach(file => {
      fs.unlink(file.path, err => {
        if (err) console.error("Failed to delete temp file:", file.path);
      });
    });

    return res.status(200).json({ status: "success", message: `Email sent to ${customer.CustomerEmail}` });
  } catch (error) {
    console.error("SendEmailToCustomer Error:", error);
    return res.status(500).json({ status: "fail", data: error.toString() });
  }
};
