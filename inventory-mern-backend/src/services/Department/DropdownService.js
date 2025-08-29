// services/DropDownService.js
const DropDownService = async (Request, DataModel, Projection, extraFilter = {}) => {
  try {
    let UserEmail = Request.headers['email'];

    let matchStage = { UserEmail: UserEmail, ...extraFilter };

    let data = await DataModel.aggregate([
      { $match: matchStage },
      { $project: Projection }
    ]);

    return { success: 'success', data: data };
  } catch (error) {
    return { success: 'fail', data: error.toString() };
  }
};

module.exports = DropDownService;
