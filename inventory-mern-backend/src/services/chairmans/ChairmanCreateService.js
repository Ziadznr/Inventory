// services/chairman/ChairmanCreateService.js
const ChairmanModel = require('../../models/Users/DepartmentChairmanModel');

const ChairmanCreateService = async (Request) => {
    try {
        let PostBody = Request.body;
        let data = await ChairmanModel.create(PostBody);
        return { status: 'success', data: data };
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = ChairmanCreateService;
