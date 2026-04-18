const nodemailer = require('nodemailer');


const { MAIL_USERNAME, MAIL_PASSWORD } = require('./envConfig');
const { BadRequestError, InternalServerError } = require('../middlewares/errors');
const { errorMessages } = require('../utils/messages');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MAIL_USERNAME,
    pass: MAIL_PASSWORD
  }
});

const sendMail = async (to, subject, template) => {
  if (!to || !subject || !template) {
    console.log("❌ All fields are required to send an email, (to, subject, template)");
    return;
    // throw new BadRequestError("All fields are required to send an email, (from, to, subject, template)")
  }
  const mailOptions = {
    from: "yourOwnStore@store.com",
    to,
    subject,
    html: template
  }
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("❌ Unable to send mail: ", error);
      throw new InternalServerError(errorMessages.SERVER_ERROR);
    }
    console.log("Email sent: " + info.response + " ✅")
  })
}

module.exports = sendMail;
