// services/chairman/ChairmanVerifyOtpService.js
const OTPSModel = require('../../models/Users/OTPSModel.js');

const ChairmanVerifyOtpService = async (Request) => {
    try {
        let email = Request.params.email;
        let OTPCode = Request.params.otp;
        let status = 0;
        let statusUpdate = 1;

        let OTPCount = await OTPSModel.aggregate([{ $match: { email: email, otp: OTPCode, status: status } }, { $count: "total" }]);

        if (OTPCount.length > 0) {
            let OTPUpdate = await OTPSModel.updateOne(
                { email: email, otp: OTPCode, status: status },
                { email: email, otp: OTPCode, status: statusUpdate }
            );
            return { status: 'success', data: OTPUpdate };
        } else {
            return { status: 'fail', data: 'Invalid OTP Code' };
        }
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = ChairmanVerifyOtpService;
