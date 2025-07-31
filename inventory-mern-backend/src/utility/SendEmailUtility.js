const nodemailer = require('nodemailer');

const SendEmailUtility = async (EmailTo, EmailText, EmailSubject) => {
    let transport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "ziadznr311@gmail.com", // your Gmail
            pass: "lomg lwty qepp qxkd" // paste new password here
        }
    });

    let mailOption = {
        from: "Inventory System <ziadznr311@gmail.com>",
        to: EmailTo,
        subject: EmailSubject,
        text: EmailText
    };

    return await transport.sendMail(mailOption);
};

module.exports = SendEmailUtility;
