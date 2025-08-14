// controllers/Departments/DepartmentController.js
const DepartmentModel = require('../../models/Departments/DepartmentModel');
const CreateService = require('../../services/common/CreateService');
const ListService = require('../../services/common/ListService');
const DeleteService = require('../../services/common/DeleteService');

// Create Department
exports.CreateDepartment = async (req, res) => {
    let result = await CreateService(req, DepartmentModel);
    res.status(200).json(result);
};

// List Departments
exports.ListDepartments = async (req, res) => {
    let SearchArray = [{ name: { $regex: req.params.searchKeyword, $options: 'i' } }];
    let result = await ListService(req, DepartmentModel, SearchArray);
    res.status(200).json(result);
};

// Delete Department
exports.DeleteDepartment = async (req, res) => {
    let result = await DeleteService(req, DepartmentModel);
    res.status(200).json(result);
};
