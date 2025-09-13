const OTPSModel = require('../../models/Users/OTPSModel.js');

const CustomerVerifyOtpService = async (email, OTP) => {
    try {
        if (!email || !OTP) {
            return { status: 'fail', data: 'Email and OTP are required' };
        }

        // Case-insensitive search for unused OTP
        const otpRecord = await OTPSModel.findOne({
            email: { $regex: `^${email.trim()}$`, $options: 'i' },
            otp: OTP,
            status: 0
        });

        if (!otpRecord) {
            return { status: 'fail', data: 'Invalid OTP Code' };
        }

        // Update OTP status to 'used'
        const updatedOTP = await OTPSModel.updateOne(
            { _id: otpRecord._id },
            { status: 1 }
        );

        return { status: 'success', data: updatedOTP };
    } catch (error) {
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = CustomerVerifyOtpService;
