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
  {
    _id: "66a083826e76d0e5ababe490",
    first: "Bob",
    last: "Brown",
    mobile: "0987654321",
    email: "cawooda@gmail.com",
    roleCustomer: null,
    roleProvider: "66a0d9f4a0eb8627cc6320f8",
    roleAdmin: null,
    password: "$2b$10$h7x.laXNIDCJ.CORSk2Wxev./cA096/T77ZnE.maZf6voAbioaxS2",
    roleSuperAdmin: false,
    sendEmails: true,
    sendTexts: false,
  },
  {
    _id: "66a083826e76d0e5ababe491",
    first: "Charlie",
    last: "Johnson",
    mobile: "1122334455",
    email: "cawooda@gmail.com",
    roleCustomer: "66a0d9f4a0eb8627cc6320f4",
    roleProvider: null,
    roleAdmin: null,
    password: "$2b$10$waiI48brvZfcMbl/7.UAF.7DnKIx1xptXaEMQl9taZ/7Kcwir4SMK",
    roleSuperAdmin: false,
    sendEmails: true,
    sendTexts: false,
  },
  {
    _id: "66a083826e76d0e5ababe492",
    first: "Diana",
    last: "Williams",
    mobile: "2233445566",
    email: "cawooda@gmail.com",
    roleCustomer: null,
    roleProvider: null,
    roleAdmin: null,
    password: "$2b$10$idCRP0uWjUvmDqkefFeOX.JLzHmJE7Ta4D/tfiZs.USlaowkPDiki",
    roleSuperAdmin: false,
    sendEmails: true,
    sendTexts: false,
  },
  {
    _id: "66a083826e76d0e5ababe493",
    first: "Eve",
    last: "Taylor",
    mobile: "3344556677",
    email: "cawooda@gmail.com",
    roleCustomer: "66a0d9f4a0eb8627cc6320f4",
    roleProvider: null,
    roleAdmin: null,
    password: "$2b$10$fQetbx8DJnQEO1lF3XW/vuQHcvKeKAKaihfkK0glPGSdn6HryJp.i",
    roleSuperAdmin: false,
    sendEmails: true,
    sendTexts: false,
  },
  {
    _id: "66a083826e76d0e5ababe494",
    first: "Frank",
    last: "Wilson",
    mobile: "4455667788",
    email: "cawooda@gmail.com",
    roleCustomer: "66a0d9f4a0eb8627cc6320f5",
    roleProvider: null,
    roleAdmin: null,
    password: "Ahimsa8*",
    roleSuperAdmin: false,
    sendEmails: true,
    sendTexts: false,
  },
];

const productSeed = [
  {
    _id: "66a0d9f4a0eb8627cc6321f1",
    name: "Example Product (02_002_0106_8_3)",
    price: 100,
  },
  {
    _id: "66a0d9f4a0eb8627cc6321f2",
    name: "CB:Counselling (15_043_0128_1_3)",
    price: 156.16,
  },
  {
    _id: "66a0d9f4a0eb8627cc6323f3",
    name: "Example Product(15_037_0117_1_3)",
    price: 67.56,
  },
  {
    _id: "66a0d9f4a0eb8627cc6324f5",
    name: "CB:Housing Support (08_005_106_2_3)",
    price: 77.0,
  },
  {
    name: "CB:Innovative Community Participation",
    price: 0.0,
  },
  {
    name: "CORE:L1 Community access - Public Holiday (04_102_0125_6_1)",
    price: 150.1,
  },
  {
    name: "CORE:L1 Community Access - Weekday (04_104_0125_6_1)",
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
    linkedCustomers: ["66d6b24c6bea26447abaeaf9", "66a0d9f4a0eb8627cc6320f5"],
    serviceAgreements: [],
  },
  {
    _id: "66a0d9f4a0eb8627cc6320f8",
    user: "66a083826e76d0e5ababe490",
    abn: "9876543210",
    address: {
      street: "789 Example Rd",
      city: "Example City",
      state: "Sample State",
      postalCode: "54321",
    },
    providerName: "Provider 2",

    services: ["66a0d9f4a0eb8627cc6323f4", "66a0d9f4a0eb8627cc6323f6"],
    notes: "Provider 2 notes.",
    linkedCustomers: ["66a0d9f4a0eb8627cc6320f4", "66a0d9f4a0eb8627cc6320f5"],
    serviceAgreements: [],
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
  {
    _id: "66a0d9f4a0eb8627cc6320f5",
    user: "66a083826e76d0e5ababe494",
    serviceAgreementEmail: "cawooda@gmail.com",
    invoiceEmail: "cawooda@gmail.com",
    referenceNumber: "5614406998",
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
  {
    _id: "66a0d9f4a0eb8627cc6321f0",
    provider: "66a0d9f4a0eb8627cc6320f7",
    product: "66a0d9f4a0eb8627cc6323f3",
    active: true,
    price: 40,
  },
  {
    _id: "66a0d9f4a0eb8627cc6323f4",
    provider: "66a0d9f4a0eb8627cc6320f8",
    product: "66a0d9f4a0eb8627cc6324f5",
    active: true,
    price: 77.0,
  },
  {
    _id: "66a0d9f4a0eb8627cc6323f6",
    provider: "66a0d9f4a0eb8627cc6320f8",
    product: "66a0d9f4a0eb8627cc6321f2",
    active: true,
    price: 67.56,
  },
];

const shiftSeed = [
  {
    _id: "66a0d9f4a0eb8627cc6321f3",
    customer: "66a0d9f4a0eb8627cc6320f4",
    provider: "66a0d9f4a0eb8627cc6320f7",
    start_time: "2024-08-19T09:00:00.000Z",
    end_time: "2024-08-19T17:00:00.000Z",
    service: "66a0d9f4a0eb8627cc6320f9",
    units: 8.0,
    createdAt: "2024-08-19T00:00:00.000Z",
    updatedAt: "2024-08-19T00:00:00.000Z",
  },
  {
    _id: "66a0d9f4a0eb8627cc6321f4",
    customer: "66a0d9f4a0eb8627cc6320f5",
    provider: "66a0d9f4a0eb8627cc6320f8",
    start_time: "2024-08-19T10:00:00.000Z",
    end_time: "2024-08-19T18:00:00.000Z",
    service: "66a0d9f4a0eb8627cc6321f0",
    units: 8.0,
    createdAt: "2024-08-19T00:00:00.000Z",
    updatedAt: "2024-08-19T00:00:00.000Z",
  },
];

const agreementSeed = [
  {
    agreementNumber: "1001",
    provider: "66a0d9f4a0eb8627cc6320f7",
    customer: "66a0d9f4a0eb8627cc6320f4",
    startDate: "2024-08-20T00:00:00.000Z",
    endDate: "2025-08-20T00:00:00.000Z",
    customerSignature: null,
    providerSignature: null,
    service: "66a0d9f4a0eb8627cc6320f9",
    quantity: 1,
    approvedByCustomer: false,
    agreementPath: null,
  },
  {
    agreementNumber: "1002",
    provider: "66a0d9f4a0eb8627cc6320f8",
    customer: "66a0d9f4a0eb8627cc6320f5",
    startDate: "2024-08-20T00:00:00.000Z",
    endDate: "2025-08-20T00:00:00.000Z",
    customerSignature: null,
    providerSignature: null,
    service: "66a0d9f4a0eb8627cc6323f4",
    quantity: 2,
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
