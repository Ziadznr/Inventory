const mongoose = require('mongoose');
const DataModel = require('../../models/Customers/CustomersModel');
const CreateService = require('../../services/common/CreateService');
const UpdateService = require('../../services/common/UpdateService');
const ListService = require('./CustomerService');
const DropDownService = require('../../services/common/DropDownService');
const DeleteService = require('../../services/common/DeleteService');
const CheckAssociationService = require('../../services/common/CheckAssociateService');
const SalesModel = require('../../models/Sales/SalesModel');
const DetailsByIDService = require('../../services/common/DetailsByIDService');

// ------------------ Create Customer ------------------
exports.CreateCustomers = async (req, res) => {
  try {
    const Result = await CreateService(req, DataModel);
    res.status(200).json(Result);
  } catch (error) {
    res.status(500).json({ status: "error", data: error.toString() });
  }
};

// ------------------ Update Customer ------------------
exports.UpdateCustomers = async (req, res) => {
  try {
    const Result = await UpdateService(req, DataModel);
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
      { UserEmail: SearchRgx },   // ✅ Updated from Email → UserEmail
      { Address: SearchRgx }
    ];

    // Match query for category filter
    let MatchQuery = {};
    if (category !== "All") {
      MatchQuery.Category = category;
    }

    const Result = await ListService(req, DataModel, SearchArray, MatchQuery);
    res.status(200).json(Result);
  } catch (error) {
    res.status(500).json({ status: "error", data: error.toString() });
  }
};

// ------------------ Customer Dropdown ------------------
exports.CustomersDropdown = async (req, res) => {
  try {
    const Result = await DropDownService(
      req,
      DataModel,
      { _id: 1, CustomerName: 1, Category: 1, UserEmail: 1 }  // ✅ Added UserEmail in dropdown
    );
    res.status(200).json(Result);
  } catch (error) {
    res.status(500).json({ status: "error", data: error.toString() });
  }
};

// ------------------ Customer Details by ID ------------------
exports.CustomersDetailsByID = async (req, res) => {
  try {
    const Result = await DetailsByIDService(req, DataModel);
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

    const Result = await DeleteService(req, DataModel);
    return res.status(200).json({ status: "success", data: "Customer deleted successfully" });

  } catch (error) {
    console.error("DeleteCustomer error:", error);
    return res.status(500).json({ status: "error", data: error.toString() });
  }
};
