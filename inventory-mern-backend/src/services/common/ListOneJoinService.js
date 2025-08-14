const ListOneJoinService = async (Request, DataModel, SearchArray, JoinStage) => {
    try {
        const pageNo = Number(Request.params.pageNo);
        const perPage = Number(Request.params.perPage);
        const searchValue = Request.params.searchKeyword;
        const skipRow = (pageNo - 1) * perPage;

        // Get user email from request (from auth middleware)
        const UserEmail = Request.user?.email; // <-- define it properly

        // If you don't need user filtering, you can skip UserEmail entirely:
        // const matchStage = {};
        const matchStage = UserEmail ? { UserEmail } : {};

        let data;
        if (searchValue !== "0") {
            data = await DataModel.aggregate([
                { $match: matchStage },
                JoinStage,
                { $match: { $or: SearchArray } },
                {
                    $facet: {
                        Total: [{ $count: "count" }],
                        Rows: [{ $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        } else {
            data = await DataModel.aggregate([
                { $match: matchStage },
                JoinStage,
                {
                    $facet: {
                        Total: [{ $count: "count" }],
                        Rows: [{ $skip: skipRow }, { $limit: perPage }]
                    }
                }
            ]);
        }

        return { status: "success", data: data };
    } catch (error) {
        return { status: "error", data: error.toString() };
    }
};

module.exports = ListOneJoinService;
