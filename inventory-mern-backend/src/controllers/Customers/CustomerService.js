const ListService = async (req, DataModel, SearchArray = [], MatchQuery = {}) => {
  try {
    const pageNo = Number(req.params.pageNo) || 1;
    const perPage = Number(req.params.perPage) || 20;
    const searchKeyword = req.params.searchKeyword || "0";
    const skipRow = (pageNo - 1) * perPage;

    let matchStage = { ...MatchQuery };

    if (searchKeyword !== "0" && SearchArray.length > 0) {
      matchStage = { ...matchStage, $or: SearchArray };
    }

    const data = await DataModel.aggregate([
      { $match: matchStage },

      // ---------------- Lookup Faculty ----------------
      {
        $lookup: {
          from: "faculties",
          localField: "Faculty",
          foreignField: "_id",
          as: "FacultyData"
        }
      },
      { $unwind: { path: "$FacultyData", preserveNullAndEmptyArrays: true } },

      // ---------------- Lookup Department ----------------
      {
        $lookup: {
          from: "departments",
          localField: "Department",
          foreignField: "_id",
          as: "DepartmentData"
        }
      },
      { $unwind: { path: "$DepartmentData", preserveNullAndEmptyArrays: true } },

      // ---------------- Lookup Section ----------------
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

    if (data.length > 0 && !data[0].Total.length) {
      data[0].Total.push({ count: 0 });
    }

    return { success: "success", data };
  } catch (error) {
    console.error("ListService error:", error);
    return { status: "fail", data: error.toString() };
  }
};

module.exports = ListService;
