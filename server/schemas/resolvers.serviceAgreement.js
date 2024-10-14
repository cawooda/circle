require("dotenv").config();
const path = require("path");
const fs = require("fs");
const dayjs = require("dayjs");
const { generateRandomNumber } = require("../utils/helpers");
const { convertToPdf } = require("../utils/pdfUtility");
const { EMAILService } = require("../utils/mailer");
const userEmailService = new EMAILService();
const { addProviderDirectory } = require("../setup.config");

const { User, ServiceAgreement, Service } = require("../models");

const { renderTemplate } = require("../templates/renderTemplate");

module.exports = {
  getServiceAgreements: async (_parent, { userId }, context) => {
    try {
      const user = await User.findById(context.user._id);
      await user.populate("roleProvider", "roleCustomer");
      const allServiceAgreements = await ServiceAgreement.find();

      const serviceAgreements = await ServiceAgreement.find({
        $or: [{ provider: user.roleProvider }, { customer: user.roleCustomer }],
      })
        .populate("provider")
        .populate("customer")
        .populate({ path: "product", model: "product" });
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
    {
      provider,
      customer,
      startDate,
      endDate,
      quantity,
      service,
      providerSignature,
    },
    context
  ) => {
    if (!(context.user.roleProvider._id == provider))
      throw new Error("provider is not in context. not valid");
    servicePopulated = await Service.findById(service).populate("product");
    try {
      const newServiceAgreement = await ServiceAgreement.create({
        provider: provider || null,
        customer: customer || null,
        startDate: new Date() || null,
        service: servicePopulated || null,
        quantity: quantity || null,
        endDate: endDate || null,
        providerSignature: providerSignature || null,
      });
      // Populate paths individually to fix an issue I cant trace
      await newServiceAgreement.populate("customer");
      await newServiceAgreement.populate("provider");
      await newServiceAgreement.populate("service");
      await newServiceAgreement.populate("service.product");
      await newServiceAgreement.populate("customer.user");
      await newServiceAgreement.populate("provider.user");
      newServiceAgreement.save();

      const link =
        process.env.NODE_ENV == "development"
          ? `${process.env.HOST}${":"}${process.env.CLIENT_PORT}/agreement/${
              newServiceAgreement.agreementNumber
            }`
          : `${process.env.HOST}/agreement/${newServiceAgreement.agreementNumber}`;

      const newServiceAgreementRenderedEmail = renderTemplate(
        { ...newServiceAgreement.toObject(), link },
        "newServiceAgreementEmail"
      );

      newServiceAgreement.customer.user.sendMessage(
        `New Service Agreement`,
        `Hi ${newServiceAgreement.customer.user.first}, a new service agreement with ${newServiceAgreement.provider.providerName} agreement is ready. ${link}`,
        newServiceAgreementRenderedEmail,
        null
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
      const signedServiceAgreement = await ServiceAgreement.findOne({
        _id: agreementId,
      })
        .populate([
          {
            path: "customer",
            model: "customer",
            populate: { path: "user", model: "user" },
          },
          {
            path: "provider",
            model: "provider",
            populate: { path: "user", model: "user" },
          },
          ,
          {
            path: "service",
            model: "service",
            populate: { path: "product", model: "product" },
          },
        ])
        .exec();
      console.log(signedServiceAgreement.service.product.name);
      if (!signedServiceAgreement.service.product.name) {
        console.log(signedServiceAgreement.service.product.name);
        throw new Error("could not populate product name");
      }

      if (customerSignature) {
        signedServiceAgreement.approvedByCustomer = true;
        signedServiceAgreement.customerSignature = customerSignature;
      }
      const first = signedServiceAgreement.customer.user.first;
      const last = signedServiceAgreement.customer.user.last;
      const providerName = signedServiceAgreement.provider.providerName;
      const service = signedServiceAgreement.service;

      const startDate = dayjs(
        new Date(signedServiceAgreement?.startDate)
      ).format("DD-MM-YYYY");
      const endDate = dayjs(new Date(signedServiceAgreement?.endDate)).format(
        "DD-MM-YYYY"
      );

      //makes use of the renderTemlate function to use a template to display the signedServiceagreement
      const signedServiceAgreementObject = signedServiceAgreement.toObject();

      const renderPreparedServiceAgreement = {
        ...signedServiceAgreementObject,
        startDate: startDate,
        endDate: endDate,
      };

      const renderedHtml = renderTemplate(
        renderPreparedServiceAgreement,
        "serviceAgreementTemplate"
      );

      // Define the directory path. checks if a direcotry exists and creates it if needed.
      // modify this to sanitise the directory
      // strip out invalid filename characters
      const directoryPath = addProviderDirectory(providerName);

      const outputFileName = path.join(
        directoryPath,
        `/ServiceAgreement-${providerName}-${first}${last}-${startDate}-${generateRandomNumber(
          1,
          30000
        )}.pdf`
      );

      //convert it to pdf, saving at the outPutFileName
      await convertToPdf(renderedHtml, outputFileName);
      //find the customer to email to them.
      // const customerUser = await User.findById(
      //   signedServiceAgreement.customer.user._id
      // );

      const renderedEmail = renderTemplate(
        {
          subject: "New Service Agreement",
          first,
          providerName,
          service,
          startDate,
          endDate,
        },
        "emailTemplate"
      );
      if (signedServiceAgreement?.customer?.user?.email) {
        userEmailService.sendMail(
          [
            signedServiceAgreement?.customer?.user?.email,
            signedServiceAgreement?.provider?.user?.email,
            signedServiceAgreement?.customer?.serviceAgreementEmail,
          ],
          "A new Service Agreement has Arrived",
          `Hello,
          A new service agreement between ${signedServiceAgreement.customer.user.first} ${signedServiceAgreement.customer.user.last} with ${signedServiceAgreement.provider.providerName} for
          ${signedServiceAgreement?.service.product.name}. 
          We've attached a copy for your reccords and included your plan manager for reference.
          Have a great day.
        `,
          renderedEmail,
          outputFileName
        );
      }
      signedServiceAgreement.agreementPath = outputFileName;
      await signedServiceAgreement.save();
      await signedServiceAgreement.toObject();
      return {
        success: true,
        message: "Service Agreement Signed",
        agreementNumber: signedServiceAgreement.agreementNumber,
      };
    } catch (error) {
      console.error(
        `Error in signServiceAgreementsigned Service Agreement: `,
        error
      );
      throw error;
    }
  },
  getServiceAgreement: async (__parent, { agreementNumber }, context) => {
    try {
      const serviceAgreement = await ServiceAgreement.findOne({
        agreementNumber: agreementNumber,
      });
      await serviceAgreement.populate([
        {
          path: "customer",
          model: "customer",
          populate: { path: "user", model: "user" },
        },
        {
          path: "provider",
          model: "provider",
          populate: { path: "user", model: "user" },
        },
        {
          path: "customer",
          model: "customer",
          populate: { path: "user", model: "user" },
        },
        {
          path: "service",
          model: "service",
          populate: { path: "product", model: "product" },
        },
      ]);

      await serviceAgreement.toObject();

      return serviceAgreement;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
