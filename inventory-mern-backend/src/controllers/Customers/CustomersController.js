const DataModel = require('../../models/Customers/CustomersModel');
const CreateService = require('../../services/common/CreateService');
const UpdateService = require('../../services/common/UpdateService');
const ListService = require('../../services/common/ListService');
const DropDownService = require('../../services/common/DropDownService');
const mongoose = require('mongoose');
const DeleteService = require('../../services/common/DeleteService');
const CheckAssociationService = require('../../services/common/CheckAssociateService');
const SalesModel = require('../../models/Sales/SalesModel');
const DetailsByIDService = require('../../services/common/DetailsByIDService');


exports.CreateCustomers = async (req, res) => {
    let Result=await CreateService(req,DataModel)
    res.status(200).json(Result);
}

exports.UpdateCustomers = async (req, res) => {
    let Result=await UpdateService(req,DataModel)
    res.status(200).json(Result);
}

exports.CustomersList = async (req, res) => {
    let SearchRgx={'$regex':req.params.searchKeyword, '$options':'i'};
    let SearchArray = [{CustomerName: SearchRgx}, {Phone: SearchRgx}, {Email: SearchRgx}, {Address: SearchRgx}];  
    let Result=await ListService(req,DataModel,SearchArray)
    res.status(200).json(Result);
}   

exports.CustomersDropdown = async (req, res) => {
    let Result=await DropDownService(req,DataModel,{_id:1, Name:1})
    res.status(200).json(Result);
}

exports.CustomerDetailsByID=async(req,res)=>{
  let Result=await DetailsByIDService(req,DataModel)
  res.status(200).json(Result);
}

exports.DeleteCustomer = async (req, res) => {
  let DeleteID = req.params.id;
  let ObjectId=mongoose.Types.ObjectId;
  let CheckAssociate = await CheckAssociationService({CustomerID: ObjectId(DeleteID)}, SalesModel);
  if (CheckAssociate) {
    return res.status(400).json({ message: "This Brand is associated with Products, cannot be deleted." });
  }else {
    const Result = await DeleteService(req, DataModel);
    res.status(200).json(Result);
  }
}