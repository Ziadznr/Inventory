const mongoose = require('mongoose');

const DropDownService = async (req, DataModel, Projection) => {
  try {
    const UserEmail = req.headers['email'];
    if (!UserEmail) throw new Error("Unauthorized: Missing email header");

    console.log("Incoming Request Headers:", req.headers);
    console.log("Query Parameters:", req.query);

    const filter = { UserEmail };
    if (req.query.category) filter.Category = req.query.category;

    // Apply filters based on category
    if (req.query.category === "Dean" && req.query.facultyID) {
      filter.Faculty =new mongoose.Types.ObjectId(req.query.facultyID);
      console.log("Category = Dean → Faculty Filter Applied:", filter.Faculty);
    }

    if (["Teacher", "Chairman"].includes(req.query.category)) {
      if (req.query.facultyID) filter.Faculty =new mongoose.Types.ObjectId(req.query.facultyID);
      if (req.query.departmentID) filter.Department =new mongoose.Types.ObjectId(req.query.departmentID);
      console.log("Faculty + Department Filter for Chairman/Teacher:", filter.Faculty, filter.Department);
    }

    if (req.query.category === "Officer" && req.query.sectionID) {
      filter.Section =new mongoose.Types.ObjectId(req.query.sectionID);
      console.log("Category = Officer → Section Filter Applied:", filter.Section);
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
