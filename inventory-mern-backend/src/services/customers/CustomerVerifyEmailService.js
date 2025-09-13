const OTPSModel = require('../../models/Users/OTPSModel.js');
const SendEmailUtility = require('../../utility/SendEmailUtility.js');
const CustomersModel = require('../../models/Customers/CustomersModel');

const CustomerVerifyEmailService = async (emailInput) => {
    try {
        console.log("Received email for OTP:", emailInput);

        if (!emailInput) {
            console.log("Error: Email is missing");
            return { status: 'fail', data: 'Email is required' };
        }

        // Normalize input: trim spaces and lowercase
        const email = emailInput.trim().toLowerCase();

        // Find the customer (case-insensitive)
        const user = await CustomersModel.findOne({
            CustomerEmail: { $regex: `^${email}$`, $options: 'i' }
        });

        console.log("User found:", user);

        if (!user) {
            console.log("Error: No Customer Found for email", email);
            return { status: 'fail', data: 'No Customer Found' };
        }

        // Generate 6-digit OTP
        const OTPCode = Math.floor(100000 + Math.random() * 900000);
        console.log("Generated OTP:", OTPCode);

        // Save OTP using the exact email from DB
        const otpRecord = await OTPSModel.create({ email: user.CustomerEmail.trim().toLowerCase(), otp: OTPCode, status: 0 });
        console.log("OTP record saved:", otpRecord);

        // Send OTP via email
        const sendResult = await SendEmailUtility(
            user.CustomerEmail,
            `Your PIN Code is ${OTPCode}`,
            "Inventory System PIN Verification"
        );
        console.log("Email send result:", sendResult);

        return { status: "success", data: "OTP sent" };
    } catch (error) {
        console.error("Error in CustomerVerifyEmailService:", error);
        return { status: 'fail', data: error.toString() };
    }
};

module.exports = CustomerVerifyEmailService;
