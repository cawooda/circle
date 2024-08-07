require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
class EMAILService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendMail(to, subject, text = "", html = "", attachment) {
    console.log("mailer send email reached attachement", attachment);
    try {
      const info = await this.transporter.sendMail({
        from: '"Hello" <hello@circleindependent.com>', // sender address
        to, // list of receivers
        subject, // Subject line
        text, // plain text body
        html, // html body
        attachments: [
          {
            // file on disk as an attachment
            filename: "service-agreement.pdf",
            path: attachment, // stream this file
          },

          // Another alternative using streams
          {
            filename: "service-agreement-stream.pdf",
            content: fs.createReadStream(attachment),
          },
        ],
      });
      console.log("email", info.messageId);
      return info.messageId;
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

module.exports = { EMAILService };
