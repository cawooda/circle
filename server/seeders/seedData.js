const userSeed = [
  {
    _id: "66a083826e76d0e5ababe48f",
    first: "AndrewMasterUser",
    last: "Cawood",
    mobile: "0400442612",
    email: "cawooda@gmail.com",
    roleCustomer: "66d6b24c6bea26447abaeaf9",
    roleProvider: "66a0d9f4a0eb8627cc6320f7",
    roleAdmin: "66a0d9f4a0eb8627cc6320fa",
    password: "$2b$10$vMjCMGzbBeIfEtVLw4gbseVwv5LKJsA3npGoTXEApZrLSxDfi5KVy",
    roleSuperAdmin: true,
    sendEmails: true,
    sendTexts: true,
  },
];

const productSeed = [
  {
    _id: "66a0d9f4a0eb8627cc6321f1",
    name: "Example Product (02_002_0106_8_3)",
    price: 100,
  },
  {
    _id: "66a0d9f4a0eb8627cc6323f3",
    name: "Example Product(15_037_0117_1_3)",
    price: 67.56,
  },
];

const providerSeed = [
  {
    _id: "66a0d9f4a0eb8627cc6320f7",
    user: "66a083826e76d0e5ababe48f",
    abn: "1234567890",
    address: {
      street: "456 New St",
      city: "Cityville",
      state: "Stateville",
      postalCode: "12345",
    },
    providerName: "MasterProvider",
    notes: "Provider 1 notes.",
    linkedCustomers: ["66d6b24c6bea26447abaeaf9"],
    serviceAgreements: ["66a0d9f4a0eb8627cc6321f3"],
    shifts: ["66a0d9f4a0eb8627cc6321f3"],
  },
];

const customerSeed = [
  {
    _id: "66d6b24c6bea26447abaeaf9",
    user: "66a083826e76d0e5ababe48f",
    serviceAgreementEmail: "cawooda@gmail.com",
    invoiceEmail: "cawooda@gmail.com",
    referenceNumber: "5614406130",
    referenceName: "NDIS Number",
  },
];

const serviceSeed = [
  {
    _id: "66a0d9f4a0eb8627cc6320f9",
    provider: "66a0d9f4a0eb8627cc6320f7",
    product: "66a0d9f4a0eb8627cc6321f1",
    active: true,
    price: 100.14,
  },
];

const shiftSeed = [
  {
    _id: "66a0d9f4a0eb8627cc6321f3",
    customer: "66d6b24c6bea26447abaeaf9",
    provider: "66a0d9f4a0eb8627cc6320f7",
    start_time: "2024-08-19T09:00:00.000Z",
    end_time: "2024-08-19T17:00:00.000Z",
    service: "66a0d9f4a0eb8627cc6320f9",
    units: 8.0,
    createdAt: "2024-08-19T00:00:00.000Z",
    updatedAt: "2024-08-19T00:00:00.000Z",
  },
];

const agreementSeed = [
  {
    _id: "66a0d4f4a0eb4627cc5320f7",
    agreementNumber: "1001",
    provider: "66a0d9f4a0eb8627cc6320f7",
    customer: "66d6b24c6bea26447abaeaf9",
    startDate: "2024-08-20T00:00:00.000Z",
    endDate: "2025-08-20T00:00:00.000Z",
    customerSignature: null,
    providerSignature: null,
    service: "66a0d9f4a0eb8627cc6320f9",
    quantity: 1,
    approvedByCustomer: false,
    agreementPath: null,
  },
];

// defaultTerms.js

const defaultTermsAndConditions = [
  {
    heading: "Service Provision",
    paragraph:
      "We're excited to provide you with the service described in this agreement at a time that works for both of us. Just remember, if you need to cancel an appointment, please give us at least 7 days' notice to avoid charges to your NDIS plan.",
  },
  {
    heading: "Confidentiality",
    paragraph:
      "Your privacy matters to us! We promise not to share your personal information with others without your consent. However, there might be rare situations where the law requires us to disclose information to ensure someone's safety, even without your permission.",
  },
  {
    heading: "Courtesy and Respect",
    paragraph:
      "We believe in treating each other with courtesy and respect, and we kindly ask you to do the same. We understand that everyone has tough days, but please remember that abusive language or threats are not acceptable and may lead to service termination or even police involvement.",
  },
  {
    heading: "Cancellation or Suspension of Service",
    paragraph:
      "Feel free to cancel or suspend this service agreement at any time by sending us a written notice. If you just need a break, suspending the agreement lets you take some time off without fully canceling the service.",
  },
  {
    heading: "Feedback",
    paragraph:
      "We'd love to hear your thoughts about our service! Whether it's a compliment or a complaint, your feedback helps us improve. Please don't hesitate to let us know, contact us after an appointment, or visit circlesupports.com to submit your feedback for review and follow-up.",
  },
  {
    heading: "Travel",
    paragraph:
      "We charge travel time up to 1 hour to and from an appointment and the home base of a worker. Where workers see multiple customers in the same region, we aim to fairly apportion this cost. We charge the NDIS rate for kilometers traveled, which is updated in line with the NDIS price guide.",
  },
  {
    heading: "Invoicing",
    paragraph:
      "After delivering services, we'll send an invoice to your plan manager. If you'd like a copy for yourself, just let us know, and we'll happily provide one.",
  },
];

module.exports = {
  defaultTermsAndConditions,
  userSeed,
  customerSeed,
  providerSeed,
  productSeed,
  serviceSeed,
  shiftSeed,
  agreementSeed,
};
