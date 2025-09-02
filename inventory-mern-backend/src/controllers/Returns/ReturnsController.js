const ParentModel = require('../../models/Returns/ReturnsModel');
const ChildsModel = require('../../models/Returns/ReturnsProductsModel');
const CreateParentChildsService = require('../../services/common/CreateParentChildsService');
const ListOneJoinService = require('../../services/common/ListOneJoinService');
const DeleteParentChildsService = require('../../services/common/DeleteParentChildsService');
const ReturnReportService = require('../../services/report/ReturnReportService');
const ReturnSummeryService = require('../../services/summery/ReturnSummeryService');

exports.CreateReturns = async (req, res) => {
    let Result = await CreateParentChildsService(req, ParentModel, ChildsModel, 'ReturnID');
    res.status(200).json(Result);
}

exports.ReturnList = async (req, res) => {
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

        // Lookup products (child)
        const JoinProducts = {
            $lookup: {
                from: "returnsproducts",
                localField: "_id",      // parent _id
                foreignField: "ReturnID", // child ReturnID
                as: "products"
            }
        };

        const MatchStage = {
            $match: {
                $or: [
                    { Reason: SearchRgx },
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
            JoinProducts,   // include products here
            MatchStage
        ]);

        console.log("Raw Result from aggregate:", JSON.stringify(Result, null, 2));

        const Data = Result.map(returnDoc => {
  const customer = returnDoc.customers?.[0] || {};
  return {
    ...returnDoc,
    GivenDate: returnDoc.GivenDate,  // manual sale date
    CustomerData: {
      CustomerName: customer.CustomerName || "-",
      Category: customer.Category || "-",
      FacultyName: returnDoc.faculty?.[0]?.Name || "-",
      DepartmentName: returnDoc.department?.[0]?.Name || "-",
      SectionName: returnDoc.section?.[0]?.Name || "-"
    },
    Products: (returnDoc.products || []).map(p => ({
      ProductName: p.ProductName,
      Qty: p.Qty
    }))
  };
});


        console.log("Mapped Data with products:", JSON.stringify(Data, null, 2));

        res.status(200).json({ status: "success", data: Data });
    } catch (error) {
        console.error("ReturnList Error:", error);
        res.status(500).json({ status: "error", message: error.toString() });
    }
};

exports.ReturnsDelete = async (req, res) => {
    let Result = await DeleteParentChildsService(req, ParentModel, ChildsModel, 'ReturnID');
    res.status(200).json(Result);
}

exports.ReturnByDate = async (req, res) => {
    let Result = await ReturnReportService(req);
    res.status(200).json(Result);
}

exports.ReturnSummery = async (req, res) => {
    let Result = await ReturnSummeryService(req);
    res.status(200).json(Result);
}
