const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { EMAILService } = require("./mailer"); // replace with actual path

jest.mock("nodemailer");
jest.mock("fs");

describe("EMAILService", () => {
  let emailService;
  let mockTransporter;

  beforeEach(() => {
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: "mockedMessageId" }),
    };
    nodemailer.createTransport.mockReturnValue(mockTransporter);
    emailService = new EMAILService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should send an email without attachment", async () => {
    const to = "test@example.com";
    const subject = "Test Subject";
    const text = "Test text";
    const html = "<p>Test HTML</p>";

    const messageId = await emailService.sendMail(to, subject, text, html);

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: '"Hello" <hello@circleindependent.com>',
      to,
      subject,
      text,
      html,
    });
    expect(messageId).toBe("mockedMessageId");
  });

  it("should send an email with an attachment", async () => {
    const to = "test@example.com";
    const subject = "Test Subject";
    const text = "Test text";
    const html = "<p>Test HTML</p>";
    const attachment = "path/to/attachment";

    fs.createReadStream.mockReturnValue("mockedStream");

    const messageId = await emailService.sendMail(
      to,
      subject,
      text,
      html,
      attachment
    );

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    expect(mockTransporter.sendMail).toHaveBeenCalledWith({
      from: '"Circle" <hello@circleindependent.com>',
      to,
      subject,
      text,
      html,
      attachments: [
        {
          filename: "attachment",
          content: "mockedStream",
        },
      ],
    });
    expect(fs.createReadStream).toHaveBeenCalledWith(attachment);
    expect(messageId).toBe("mockedMessageId");
  });

  it("should throw an error if sending email fails", async () => {
    const to = "test@example.com";
    const subject = "Test Subject";
    const text = "Test text";
    const html = "<p>Test HTML</p>";

    mockTransporter.sendMail.mockRejectedValue(
      new Error("Failed to send email")
    );

    await expect(
      emailService.sendMail(to, subject, text, html)
    ).rejects.toThrow("Failed to send email");

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      host: process.env.EMAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    expect(mockTransporter.sendMail).toHaveBeenCalled();
  });
});
