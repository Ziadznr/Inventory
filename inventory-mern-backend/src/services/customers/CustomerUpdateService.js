const CustomersModel = require('../../models/Customers/CustomersModel');

const CustomerUpdateService = async (Request) => {
    try {
        let email = Request.headers['email'];
        let data = await CustomersModel.updateOne(
            { CustomerEmail: email },
            Request.body
        );
        return { status: 'success', data };
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = CustomerUpdateService;
