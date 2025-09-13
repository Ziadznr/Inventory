const mongoose = require('mongoose');

const DropDownService = async (req, DataModel, Projection) => {
  try {
    console.log("Incoming Request Headers:", req.headers);
    console.log("Query Parameters:", req.query);

    const filter = {};

    // ---------------- Fetch by CustomerID if provided ----------------
    if (req.query.customerID) {
      filter._id = new mongoose.Types.ObjectId(req.query.customerID);
    }

    // ---------------- Apply category filter ----------------
    if (req.query.category && req.query.category !== "All") {
      filter.Category = req.query.category;
    }

    // ---------------- Hierarchical filters ----------------
    if (["Teacher", "Chairman"].includes(req.query.category)) {
      if (req.query.facultyID) filter.Faculty = new mongoose.Types.ObjectId(req.query.facultyID);
      if (req.query.departmentID) filter.Department = new mongoose.Types.ObjectId(req.query.departmentID);
    }

    if (req.query.category === "Officer" && req.query.sectionID) {
      filter.Section = new mongoose.Types.ObjectId(req.query.sectionID);
    }

    console.log("Final Filter Object:", filter);

    const data = await DataModel.aggregate([
      { $match: filter },
      { $project: Projection }
    ]);

    console.log("Dropdown Data Fetched:", data);

    return { status: 'success', data };
  } catch (error) {
    console.error("DropDownService error:", error);
    return { status: 'fail', data: error.toString() };
  }
};

module.exports = DropDownService;
