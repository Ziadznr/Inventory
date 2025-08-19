// services/chairman/ChairmanResetPassService.js
const OTPSModel = require('../../models/Users/OTPSModel.js');
const ChairmanModel = require('../../models/Users/DepartmentChairmanModel.js');

const ChairmanResetPassService = async (Request) => {
    let email = Request.body['email'];
    let OTPCode = Request.body['OTP'];
    let NewPass = Request.body['password'];
    let statusUpdate = 1;

    try {
        let OTPUsedCount = await OTPSModel.aggregate([{ $match: { email: email, otp: OTPCode } }]);
        if (OTPUsedCount.length > 0) {
            let PassUpdate = await ChairmanModel.updateOne({ email: email }, { password: NewPass });
            return { status: 'success', data: PassUpdate };
        } else {
            return { status: 'fail', data: "Invalid Request" };
        }
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = ChairmanResetPassService;
