const ParentModel = require('../../models/Sales/SalesModel');
const ChildsModel = require('../../models/Sales/SalesProductsModel');
const CreateParentChildsService = require('../../services/common/CreateParentChildsService');
const ListOneJoinService = require('../../services/common/ListOneJoinService');
const DeleteParentChildsService = require('../../services/common/DeleteParentChildsService');
const SalesReportService = require('../../services/report/SalesReportService');
const SalesSummeryService = require('../../services/summery/SalesSummeryService');

exports.CreateSales = async (req, res) => {
    let Result = await CreateParentChildsService(req, ParentModel, ChildsModel, 'SaleID');
    res.status(200).json(Result);
}

exports.SalesList = async (req, res) => {
    let SearchRgx={'$regex':req.params.searchKeyword, '$options':'i'};
    let JoinStage={$lookup:{from:'customers', localField:'CustomerID', foreignField:'_id', as:'customers'}};
    let SearchArray=[{Note:SearchRgx}, {'customers.CustomerName':SearchRgx}, {'customers.Address':SearchRgx}, {'customers.Phone':SearchRgx}, {'customers.Email':SearchRgx}];
    let Result = await ListOneJoinService(req, ParentModel, SearchArray,JoinStage);
    res.status(200).json(Result);
}

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

