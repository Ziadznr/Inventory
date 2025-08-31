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
    try {
        const searchKeyword = req.params.searchKeyword || "";
        console.log("Search keyword:", searchKeyword);

        const SearchRgx = { $regex: searchKeyword, $options: "i" };

        // Lookup customers
        const JoinCustomer = {
            $lookup: {
                from: "customers",
                localField: "CustomerID",
                foreignField: "_id",
                as: "customers"
            }
        };

        // Lookup faculties
        const JoinFaculty = {
            $lookup: {
                from: "faculties",
                localField: "customers.Faculty",
                foreignField: "_id",
                as: "faculty"
            }
        };

        // Lookup departments
        const JoinDepartment = {
            $lookup: {
                from: "departments",
                localField: "customers.Department",
                foreignField: "_id",
                as: "department"
            }
        };

        // Lookup sections
        const JoinSection = {
            $lookup: {
                from: "sections",
                localField: "customers.Section",
                foreignField: "_id",
                as: "section"
            }
        };

        const MatchStage = {
            $match: {
                $or: [
                    { Note: SearchRgx },
                    { "customers.CustomerName": SearchRgx },
                    { "customers.Phone": SearchRgx },
                    { "customers.CustomerEmail": SearchRgx }
                ]
            }
        };

        const Result = await ParentModel.aggregate([
            JoinCustomer,
            JoinFaculty,
            JoinDepartment,
            JoinSection,
            MatchStage
        ]);

        console.log("Raw Result from aggregate:", JSON.stringify(Result, null, 2));

        const Data = Result.map(sale => {
            const customer = sale.customers?.[0] || {};
            return {
                ...sale,
                CustomerData: {
                    CustomerName: customer.CustomerName || "-",
                    Category: customer.Category || "-",
                    FacultyName: sale.faculty?.[0]?.Name || "-",
                    DepartmentName: sale.department?.[0]?.Name || "-",
                    SectionName: sale.section?.[0]?.Name || "-"
                }
            };
        });

        console.log("Mapped Data:", JSON.stringify(Data, null, 2));

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

