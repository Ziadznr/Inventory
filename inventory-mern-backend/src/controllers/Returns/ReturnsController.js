const ParentModel = require('../../models/Returns/ReturnsModel');
const ChildsModel = require('../../models/Returns/ReturnsProductsModel');
const CreateParentChildsService = require('../../services/common/CreateParentChildsService');
const ListOneJoinService = require('../../services/common/ListOneJoinService');
const DeleteParentChildsService = require('../../services/common/DeleteParentChildsService');
const ReturnReportService = require('../../services/report/ReturnReportService');
const ReturnSummeryService=require('../../services/summery/ReturnSummeryService')

exports.CreateReturns = async (req, res) => {
    let Result = await CreateParentChildsService(req, ParentModel, ChildsModel, 'ReturnID');
    res.status(200).json(Result);
}

exports.ReturnsList = async (req, res) => {
    let SearchRgx={'$regex':req.params.searchKeyword, '$options':'i'};
    let JoinStage={$lookup:{from:'customers', localField:'CustomerID', foreignField:'_id', as:'customers'}};
    let SearchArray=[{Note:SearchRgx}, {'customers.CustomerName':SearchRgx}, {'customers.Address':SearchRgx}, {'customers.Phone':SearchRgx}, {'customers.Email':SearchRgx}];
    let Result = await ListOneJoinService(req, ParentModel, SearchArray,JoinStage);
    res.status(200).json(Result);
}

exports.ReturnsDelete = async (req, res) => {
    let Result = await DeleteParentChildsService(req, ParentModel, ChildsModel, 'ReturnID');
    res.status(200).json(Result);
}

exports.ReturnByDate = async (req, res) => {
    let Result = await ReturnReportService(req);
    res.status(200).json(Result);
}

exports.ReturnSummery= async (req, res) => {
    let Result = await ReturnSummeryService(req);
    res.status(200).json(Result);
}