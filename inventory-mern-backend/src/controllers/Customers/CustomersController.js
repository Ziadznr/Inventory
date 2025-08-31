const mongoose = require('mongoose');
const fs = require("fs");
const path = require("path");
const CustomersModel = require('../../models/Customers/CustomersModel');
const CreateService = require('../../services/common/CreateService');
const UpdateService = require('../../services/common/UpdateService');
const ListService = require('./CustomerService');
const DropDownService = require('../../services/Customer/DropdownService');
const DeleteService = require('../../services/common/DeleteService');
const CheckAssociationService = require('../../services/common/CheckAssociateService');
const SalesModel = require('../../models/Sales/SalesModel');
const DetailsByIDService = require('../../services/common/DetailsByIDService');
const SendEmailUtility = require('../../utility/SendEmailUtility');

// ------------------ Create Customer ------------------
exports.CreateCustomers = async (req, res) => {
  try {
    const Result = await CreateService(req, CustomersModel);
    res.status(200).json(Result);
  } catch (error) {
    res.status(500).json({ status: "error", data: error.toString() });
  }
};

// ------------------ Update Customer ------------------
exports.UpdateCustomers = async (req, res) => {
  try {
    const Result = await UpdateService(req, CustomersModel);
    res.status(200).json(Result);
  } catch (error) {
    res.status(500).json({ status: "error", data: error.toString() });
  }
};

// ------------------ List Customers with search & category ------------------

exports.CustomersList = async (req, res) => {
  try {
    const searchKeyword = req.params.searchKeyword || "";
    const category = req.params.category || "All";

    const SearchRgx = { $regex: searchKeyword, $options: "i" };
    const SearchArray = [
      { CustomerName: SearchRgx },
      { Phone: SearchRgx },
      { CustomerEmail: SearchRgx },
      { UserEmail: SearchRgx }
    ];

    let MatchQuery = {};
    if (category !== "All") {
      MatchQuery.Category = category;
    }

    // Call ListService with lookups already inside
    const Result = await ListService(req, CustomersModel, SearchArray, MatchQuery);

    // No need to populate again, the aggregation already includes:
    // FacultyName, DepartmentName, SectionName

    res.status(200).json(Result);
  } catch (error) {
    console.error("CustomersList Error:", error);
    res.status(500).json({ status: "error", data: error.toString() });
  }
};


// ------------------ Customer Dropdown ------------------
exports.CustomersDropdown = async (req, res) => {
  try {
    const Result = await DropDownService(
      req,
      CustomersModel,
      { _id: 1, CustomerName: 1, Category: 1, Faculty: 1, Department: 1, Section: 1 }
    );
    res.status(200).json(Result);
  } catch (error) {
    res.status(500).json({ status: "error", data: error.toString() });
  }
};


// ------------------ Customer Details by ID ------------------
exports.CustomersDetailsByID = async (req, res) => {
  try {
    const Result = await DetailsByIDService(req, CustomersModel);
    res.status(200).json(Result);
  } catch (error) {
    res.status(500).json({ status: "error", data: error.toString() });
  }
};

// ------------------ Delete Customer with Sales association check ------------------
exports.DeleteCustomer = async (req, res) => {
  try {
    const DeleteID = req.params.id;

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

    const Result = await DeleteService(req, CustomersModel);
    return res.status(200).json({ status: "success", data: "Customer deleted successfully" });

  } catch (error) {
    console.error("DeleteCustomer error:", error);
    return res.status(500).json({ status: "error", data: error.toString() });
  }
};

// ------------------ Send Email to a Customer ------------------
exports.SendEmailToCustomer = async (req, res) => {
  try {
    const { customerId, subject, message } = req.body;
    const files = req.files || []; // multer provides uploaded files here

    // Find customer by ID
    const customer = await CustomersModel.findById(customerId);
    if (!customer) {
      return res.status(404).json({ status: "fail", message: "Customer not found" });
    }

    // Check if customer has an email
    if (!customer.CustomerEmail) {
      return res.status(400).json({ status: "fail", message: "Customer email not available" });
    }

    // Prepare attachments for email
    const attachments = files.map(file => ({
      filename: file.originalname, // original file name
      path: file.path              // file path on server
    }));

    // Send mail using utility
    await SendEmailUtility(
      customer.CustomerEmail, // To
      message,                // Body
      subject,                // Subject
      attachments             // Attachments array
    );

    // Optional: Delete uploaded files after sending
    files.forEach(file => {
      fs.unlink(file.path, err => {
        if (err) console.log("Failed to delete temp file:", file.path);
      });
    });

    res.status(200).json({ status: "success", message: `Email sent to ${customer.CustomerEmail}` });
  } catch (error) {
    res.status(500).json({ status: "error", data: error.toString() });
  }
};
