const ChairmanCreateService = require('../../services/chairmans/ChairmanCreateService');
const ChairmanLoginService = require('../../services/chairmans/ChairmanLoginService');
const ChairmanUpdateService = require('../../services/chairmans/ChairmanUpdateService');
const ChairmanDetailsService = require('../../services/chairmans/ChairmanDetailsService');
const ChairmanVerifyEmailService = require('../../services/chairmans/ChairmanVerifyEmailService');
const ChairmanVerifyOtpService = require('../../services/chairmans/ChairmanVerifyOtpService');
const ChairmanResetPassService = require('../../services/chairmans/ChairmanResetPassService');

const OTPSModel = require('../../models/Users/OTPSModel.js');
const DropDownService = require('../../services/common/DropDownService.js');
const DepartmentModel = require('../../models/Departments/DepartmentModel.js');

exports.ChairmanRegistration = async (req, res) => {
    let Result = await ChairmanCreateService(req);
    res.status(200).json(Result);
};

exports.ChairmanLogin = async (req, res) => {
    let Result = await ChairmanLoginService(req);
    res.status(200).json(Result);
};

exports.ChairmanProfileUpdate = async (req, res) => {
    let Result = await ChairmanUpdateService(req);
    res.status(200).json(Result);
};

exports.ChairmanProfileDetails = async (req, res) => {
    let Result = await ChairmanDetailsService(req);
    res.status(200).json(Result);
};

exports.ChairmanRecoverVerifyEmail = async (req, res) => {
    let Result = await ChairmanVerifyEmailService(req);
    res.status(200).json(Result);
};

exports.ChairmanRecoverVerifyOTP = async (req, res) => {
    let Result = await ChairmanVerifyOtpService(req, OTPSModel);
    res.status(200).json(Result);
};

exports.ChairmanRecoverResetPass = async (req, res) => {
    let Result = await ChairmanResetPassService(req);
    res.status(200).json(Result);
};

exports.PublicDepartments = async (req, res) => {
  try {
    const departments = await DepartmentModel.find({}, { _id: 1, Name: 1 });
    res.status(200).json({ status: "success", data: departments });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: "fail", data: "Something went wrong" });
  }
};
