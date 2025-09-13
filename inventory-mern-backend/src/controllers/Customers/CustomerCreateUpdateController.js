const CustomersModel = require('../../models/Customers/CustomersModel');
const OTPSModel = require('../../models/Users/OTPSModel');

// Import services
const CustomerCreateService = require('../../services/customers/CustomerCreateService');
const CustomerLoginService = require('../../services/customers/CustomerLoginService');
const CustomerUpdateService = require('../../services/customers/CustomerUpdateService');
const CustomerDetailsService = require('../../services/customers/CustomerDetailsService');
const CustomerVerifyEmailService = require('../../services/customers/CustomerVerifyEmailService');
const CustomerVerifyOtpService = require('../../services/customers/CustomerVerifyOtpService');
const CustomerResetPassService = require('../../services/customers/CustomerResetPassService');

// ------------------ Registration ------------------
exports.Registration = async (req, res) => {
  try {
    const result = await CustomerCreateService(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'fail', data: error.toString() });
  }
};

exports.Login = async (req, res) => {
    console.log("Login request body:", req.body); // Debug
    try {
        // Pass the request AND the model
        const result = await CustomerLoginService(req, CustomersModel);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: 'fail', data: error.toString() });
    }
};


// ------------------ Profile Update ------------------
exports.ProfileUpdate = async (req, res) => {
  try {
    const result = await CustomerUpdateService(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'fail', data: error.toString() });
  }
};

// ------------------ Profile Details ------------------
exports.ProfileDetails = async (req, res) => {
  try {
    const result = await CustomerDetailsService(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ status: 'fail', data: error.toString() });
  }
};

// ------------------ Verify Email (send OTP) ------------------
exports.RecoverVerifyEmail = async (req, res) => {
    try {
        console.log("RecoverVerifyEmail called"); 
        console.log("Request params:", req.params);

        const email = req.params.email; // <-- get the email string
        const Result = await CustomerVerifyEmailService(email); // <-- pass string

        console.log("Service result:", Result); 
        res.status(200).json(Result);
    } catch (error) {
        console.error("Error in RecoverVerifyEmail:", error); 
        res.status(500).json({ status: 'fail', data: error.toString() });
    }
};



// ------------------ Verify OTP ------------------
exports.RecoverVerifyOTP = async (req, res) => {
    let Result=await CustomerVerifyOtpService(req,OTPSModel)
    res.status(200).json(Result)
};

// ------------------ Reset Password ------------------
exports.RecoverResetPass = async (req, res) => {
  let Result=await CustomerResetPassService(req,OTPSModel)
    res.status(200).json(Result)
};
