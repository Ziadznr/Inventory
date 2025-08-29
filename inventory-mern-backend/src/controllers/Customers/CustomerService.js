const ListService = async (req, DataModel, SearchArray = [], MatchQuery = {}) => {
  try {
    const pageNo = Number(req.params.pageNo) || 1;
    const perPage = Number(req.params.perPage) || 20;
    const searchKeyword = req.params.searchKeyword || "0";
    const skipRow = (pageNo - 1) * perPage;

    let matchStage = { ...MatchQuery }; // Start with category filter

    // Apply search only if searchKeyword is not "0"
    if (searchKeyword !== "0" && SearchArray.length > 0) {
      matchStage = { ...matchStage, $or: SearchArray };
    }

    const data = await DataModel.aggregate([
      { $match: matchStage },
      {
        $facet: {
          Total: [{ $count: "count" }],
          Rows: [{ $skip: skipRow }, { $limit: perPage }]
        }
      }
    ]);

    // Ensure Total is always an array with count 0 if empty
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
