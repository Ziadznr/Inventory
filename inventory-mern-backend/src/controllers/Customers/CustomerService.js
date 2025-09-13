const ListService = async (req, DataModel, SearchArray = [], MatchQuery = {}) => {
  try {
    let pageNo = Number(req.params.pageNo) || 1;
    let perPage = Number(req.params.perPage) || 20;
    const searchKeyword = req.params.searchKeyword || "0";
    const skipRow = (pageNo - 1) * perPage;

    // Ensure valid pagination values
    if (pageNo < 1) pageNo = 1;
    if (perPage < 1) perPage = 20;

    let matchStage = { ...MatchQuery };

    // ---------------- Apply user role filter ----------------
    // req.userRole & req.userEmail should be set by auth middleware
    if (req.userRole === "Customer" && req.userEmail) {
      matchStage.UserEmail = req.userEmail; // Customer sees only their own data
    }

    // ---------------- Apply search filter ----------------
    if (searchKeyword !== "0" && SearchArray.length > 0) {
      matchStage = { ...matchStage, $or: SearchArray };
    }

    const data = await DataModel.aggregate([
      { $match: matchStage },

      // ---------------- Faculty Lookup ----------------
      {
        $lookup: {
          from: "faculties",
          localField: "Faculty",
          foreignField: "_id",
          as: "FacultyData"
        }
      },
      { $unwind: { path: "$FacultyData", preserveNullAndEmptyArrays: true } },

      // ---------------- Department Lookup ----------------
      {
        $lookup: {
          from: "departments",
          localField: "Department",
          foreignField: "_id",
          as: "DepartmentData"
        }
      },
      { $unwind: { path: "$DepartmentData", preserveNullAndEmptyArrays: true } },

      // ---------------- Section Lookup ----------------
      {
        $lookup: {
          from: "sections",
          localField: "Section",
          foreignField: "_id",
          as: "SectionData"
        }
      },
      { $unwind: { path: "$SectionData", preserveNullAndEmptyArrays: true } },

      // ---------------- Facet for pagination ----------------
      {
        $facet: {
          Total: [{ $count: "count" }],
          Rows: [
            { $skip: skipRow },
            { $limit: perPage },
            {
              $project: {
                CustomerName: 1,
                Phone: 1,
                CustomerEmail: 1,
                UserEmail: 1,
                Category: 1,
                FacultyName: "$FacultyData.Name",
                DepartmentName: "$DepartmentData.Name",
                SectionName: "$SectionData.Name"
              }
            }
          ]
        }
      }
    ]);

    // Normalize result
    let result = data[0] || { Total: [], Rows: [] };
    if (!result.Total.length) {
      result.Total = [{ count: 0 }];
    }

    return { status: "success", data: [result] };
  } catch (error) {
    console.error("ListService error:", error);
    return { status: "fail", data: error.toString() };
  }
};

module.exports = ListService;
