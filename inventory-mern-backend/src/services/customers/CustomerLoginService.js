const CreateToken = require('../../utility/CreateToken');
const CustomersModel = require('../../models/Customers/CustomersModel');

const CustomerLoginService = async (Request) => {
    try {
        const { CustomerEmail, Password } = Request.body;

        // Direct match for plain text password
        const customer = await CustomersModel.findOne({ CustomerEmail, Password });

        if (!customer) {
            return { status: 'unauthorized', data: 'Invalid email or password' };
        }

        const token = await CreateToken(customer.CustomerEmail);

        const { Password: _, ...customerData } = customer.toObject(); // exclude password
        return { status: 'success', token, data: customerData };

    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = CustomerLoginService;
