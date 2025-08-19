// services/chairman/ChairmanUpdateService.js
const ChairmanModel = require('../../models/Users/DepartmentChairmanModel');

const ChairmanUpdateService = async (Request) => {
    try {
        let data = await ChairmanModel.updateOne(
            { email: Request.headers['email'] },
            Request.body
        );
        return { status: 'success', data: data };
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = ChairmanUpdateService;
