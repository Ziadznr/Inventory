const DropDownService = async (Request,DataModel,Projection) => {
    try {
        let UserEmail = context.headers['email'];
        let data = await DataModel.aggregate([
            { $match: { UserEmail: UserEmail } },
            { $project: Projection }
        ]);
        return { success: 'success', data: data };
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
}

module.exports = DropDownService;   