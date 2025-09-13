const CustomersModel = require('../../models/Customers/CustomersModel');

const CustomerCreateService = async (Request) => {
    try {
        let PostBody = Request.body;
        let data = await CustomersModel.create(PostBody);
        return { status: 'success', data };
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = CustomerCreateService;
