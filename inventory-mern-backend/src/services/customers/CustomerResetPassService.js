const OTPSModel = require('../../models/Users/OTPSModel.js');
const CustomersModel = require('../../models/Customers/CustomersModel');

const CustomerResetPassService = async (Request) => {
    let email = Request.body['CustomerEmail'];
    let OTPCode = Request.body['OTP'];
    let NewPass = Request.body['password'];

    try {
        let OTPUsedCount = await OTPSModel.findOne({ email, otp: OTPCode, status: 0 });
        if (!OTPUsedCount) {
            return { status: 'fail', data: "Invalid OTP" };
        }

        await CustomersModel.updateOne({ CustomerEmail: email }, { password: NewPass });
        await OTPSModel.updateOne({ email, otp: OTPCode }, { status: 1 });

        return { status: 'success', data: "Password updated" };
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = CustomerResetPassService;
