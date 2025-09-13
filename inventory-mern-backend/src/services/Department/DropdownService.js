// services/DropDownService.js
const DropDownService = async (Request, DataModel, Projection, extraFilter = {}) => {
  try {
    let UserEmail = Request.headers['email'];

    // Only include UserEmail if it exists
    let matchStage = { ...extraFilter };
    if (UserEmail) matchStage.UserEmail = UserEmail;

    let data = await DataModel.aggregate([
      { $match: matchStage },
      { $project: Projection }
    ]);

    return { status: 'success', data: data };
  } catch (error) {
    return { status: 'fail', data: error.toString() };
  }
};

module.exports = DropDownService;
