const CustomersModel = require('../../models/Customers/CustomersModel');

const CustomerDetailsService = async (Request) => {
    try {
        let email = Request.headers['email'];
        let data = await CustomersModel.findOne({ CustomerEmail: email }).lean();

        if (!data) {
            return { status: "fail", data: "Customer not found" };
        }

        return { status: "success", data };
    } catch (error) {
        return { status: "fail", data: error.toString() };
    }
};

module.exports = CustomerDetailsService;
