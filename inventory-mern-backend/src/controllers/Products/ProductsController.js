const DataModel=require("../../models/Products/ProductsModel")
const CreateService = require('../../services/common/CreateService');
const UpdateService = require('../../services/common/UpdateService');
const ListTwoJoinService = require('../../services/common/ListTwoJoinService');
const DeleteService = require('../../services/common/DeleteService');
const CheckAssociationService = require('../../services/common/CheckAssociateService');
const ReturnProductsModel = require('../../models/Returns/ReturnsProductsModel');
const SalesProductsModel = require('../../models/Sales/SalesProductsModel');
const PurchasesProductsModel = require('../../models/Purchases/PurchasesProductsModel');
const mongoose = require('mongoose');
const DetailsByIDService = require("../../services/common/DetailsByIDService");

exports.CreateProduct = async (req, res) => {
    let Result=await CreateService(req,DataModel)
    res.status(200).json(Result);
}

exports.UpdateProduct = async (req, res) => {
    let Result=await UpdateService(req,DataModel)
    res.status(200).json(Result);
}

exports.ProductsList = async (req, res) => {
    let SearchRgx={'$regex':req.params.searchKeyword, '$options':'i'};
    let JoinStage1={$lookup:{from:'brands', localField:'BrandID', foreignField:'_id', as:'brands'}};
    let JoinStage2={$lookup:{from:'categories', localField:'CategoryID', foreignField:'_id', as:'categories'}};
    let SearchArray=[{Name:SearchRgx},{Unit:SearchRgx},{Details:SearchRgx},{'brands.Name':SearchRgx},{'categories.Name':SearchRgx}];
    let Result=await ListTwoJoinService(req,DataModel,SearchArray,JoinStage1,JoinStage2);
    res.status(200).json(Result);
}

exports.ProductDetailsByID=async(req,res)=>{
  let Result=await DetailsByIDService(req,DataModel)
  res.status(200).json(Result);
}

exports.DeleteProduct = async (req, res) => {
  let DeleteID = req.params.id;
  let ObjectId=mongoose.Types.ObjectId;

  let CheckReturnAssociate = await CheckAssociationService({ProductID: ObjectId(DeleteID)}, ReturnProductsModel);
  let CheckSaleAssociate = await CheckAssociationService({ProductID: ObjectId(DeleteID)}, SalesProductsModel);
  let CheckPurchaseAssociate = await CheckAssociationService({ProductID: ObjectId(DeleteID)}, PurchasesProductsModel);

  if (CheckReturnAssociate) {
    return res.status(400).json({ message: "This Product is associated with Return Products, cannot be deleted." });
  }
  else if (CheckSaleAssociate) {
    return res.status(400).json({ message: "This Product is associated with Sales Products, cannot be deleted." });
  }
  else if (CheckPurchaseAssociate) {
    return res.status(400).json({ message: "This Product is associated with Purchase Products, cannot be deleted." });
  }

  else {
    const Result = await DeleteService(req, DataModel);
    res.status(200).json(Result);
  }
}