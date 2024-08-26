const path = require("path");
const dayjs = require("dayjs");
const { generateRandomNumber } = require("../utils/helpers");
const { convertToPdf } = require("../utils/pdfUtility");
const { EMAILService } = require("../utils/mailer");
const userEmailService = new EMAILService();

const { User, Product, ServiceAgreement } = require("../models");

const { renderTemplate } = require("../templates/renderTemplate");
module.exports = {
  getServiceAgreements: async (_parent, { userId }, context) => {
    try {
      const user = await User.findById(context.user._id);
      await user.populate("roleProvider", "roleCustomer");
      const allServiceAgreements = await ServiceAgreement.find();
      // console.log(allServiceAgreements);
      const serviceAgreements = await ServiceAgreement.find({
        $or: [{ provider: user.roleProvider }, { customer: user.roleCustomer }],
      })
        .populate("provider")
        .populate("customer")
        .populate("product");
      const response = {
        success: true,
        message: "service agreements found successfully",
        serviceAgreements: serviceAgreements,
      };
      return response;
    } catch (error) {
      console.error(error);
      const errorResponse = {
        success: false,
        message: "service agreements find not successful",
        error: error,
      };
      return errorResponse;
    }
  },
  addServiceAgreement: async (
    _parent,
    { provider, customer, startDate, quantity, product, endDate, signature },
    context
  ) => {
    if (!(context.user.roleProvider._id == provider))
      throw new Error("provider is not in context. not valid");
    productPopulated = await Product.findById(product);
    try {
      const newServiceAgreement = await ServiceAgreement.create({
        provider: provider || null,
        customer: customer || null,
        startDate: new Date() || null,
        product: productPopulated || null,
        quantity: quantity || null,
        endDate: endDate || null,
        providerSignature: signature || null,
      });
      // Populate paths individually to fix an issue I cant trace
      await newServiceAgreement.populate("customer");
      await newServiceAgreement.populate("provider");
      await newServiceAgreement.populate("customer.user");
      await newServiceAgreement.populate("provider.user");
      newServiceAgreement.save();
      newServiceAgreement.customer.user.sendMessage(
        `Hi ${newServiceAgreement.customer.user.first}, a new service agreement with ${newServiceAgreement.provider.providerName} agreement is ready. Use the link to securely review and sign ;)
        `,
        `/agreement/${newServiceAgreement.agreementNumber}`,
        ""
      );

      return newServiceAgreement;
    } catch (error) {
      console.error(
        "unable to create service agreement through mutation addServiceAgreement",
        error
      );
      throw error;
    }
  },
  signServiceAgreement: async (
    _parent,
    { agreementId, customerSignature },
    context
  ) => {
    try {
      const signedServiceAgreement = await ServiceAgreement.findById(
        agreementId
      );
      // Populate paths individually to fix an issue I can't trace
      await signedServiceAgreement.populate("customer");
      await signedServiceAgreement.populate("provider");
      await signedServiceAgreement.populate("product");
      await signedServiceAgreement.populate("customer.user");
      await signedServiceAgreement.populate("provider.user");
      await signedServiceAgreement.save();

      if (customerSignature) {
        signedServiceAgreement.approvedByCustomer = true;
        signedServiceAgreement.customerSignature = customerSignature;
      }

      const first = signedServiceAgreement.customer.user?.first;
      const last = signedServiceAgreement.customer.user?.last;
      const providerName = signedServiceAgreement.provider?.providerName;
      const product = signedServiceAgreement?.product;
      const startDate = signedServiceAgreement?.startDate;

      //makes use of the renderTemlate function to use a template to display the signedServiceagreement
      const renderedHtml = renderTemplate(
        signedServiceAgreement.toObject(),
        "template"
      );
      //set the outputPath for the service agreement to be saved and then sent
      const outputPath = path.join(
        __dirname,
        `../customerData/agreements/${providerName}-${first}-${last}/ServiceAgreement-${providerName}-${first}-${last}-${dayjs(
          startDate
        ).format("DD-MM-YYYY")}-${generateRandomNumber(1, 3000000)}.pdf`
      );
      //convert it to pdf, saving at the outputPath
      const pdfPath = await convertToPdf(renderedHtml, outputPath);
      //find the customer to email to them.
      const customerUser = await User.findById(
        signedServiceAgreement.customer.user._id
      );

      const renderedEmail = renderTemplate(
        { subject: "New Service Agreement", first, providerName, product },
        "emailTemplate"
      );
      userEmailService.sendEmail(
        "A new Service Agreement has Arrived",
        ``,
        renderedEmail,
        "/",
        outputPath
      );
      // customerUser.sendEmail(
      //   "A new Service Agreement has Arrived",
      //   ``,
      //   renderedEmail,
      //   "/",
      //   outputPath
      // );

      signedServiceAgreement.agreementPath = pdfPath;
      await signedServiceAgreement.save();
      return signedServiceAgreement;
    } catch (error) {
      console.error(
        `Error in signServiceAgreementsigned Service Agreement: `,
        error
      );
      throw error;
    }
  },
};
