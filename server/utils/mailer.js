require("dotenv").config();
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

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

  async sendMail(to, subject, text, html, attachment) {
    try {
      if (attachment) {
        const info = await this.transporter.sendMail({
          from: '"Circle" <hello@circleindependent.com>', // sender address
          to,
          subject,
          text,
          html,
          attachments: [
            {
              filename: path.basename(attachment),
              content: fs.createReadStream(attachment),
            },
          ],
        });
        return info.messageId;
      } else {
        const info = await this.transporter.sendMail({
          from: '"Hello" <hello@circleindependent.com>', // sender address
          to, // list of receivers
          subject, // Subject line
          text, // plain text body
          html, // html body
        });

        return info.messageId;
      }
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

module.exports = { EMAILService };
