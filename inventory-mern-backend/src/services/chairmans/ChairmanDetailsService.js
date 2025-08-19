// services/chairman/ChairmanDetailsService.js
const ChairmanModel = require('../../models/Users/DepartmentChairmanModel');

const ChairmanDetailsService = async (Request) => {
    try {
        let data = await ChairmanModel.aggregate([
            { $match: { email: Request.headers['email'] } }
        ]);
        return { status: "success", data: data };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = ChairmanDetailsService;
