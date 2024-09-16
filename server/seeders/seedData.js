const userSeed = [
  {
    _id: "66a083826e76d0e5ababe48f",
    first: "Andrew",
    last: "Cawood",
    mobile: "0400442612",
    roleCustomer: null,
    roleProvider: "66a0d9f4a0eb8627cc6320f7",
    roleAdmin: "66a0d9f4a0eb8627cc6320fa",
    password: "Ahimsa8*",
    roleSuperAdmin: true,
    sendEmails: true,
    sendTexts: true,
  },
  {
    _id: "66a083826e76d0e5ababe490",
    first: "Bob",
    last: "Brown",
    mobile: "0987654321",
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
    name: "Assistance (07_002_0106_8_3)",
    price: 100.14,
  },
  {
    _id: "66a0d9f4a0eb8627cc6321f2",
    name: "CB:Counselling (15_043_0128_1_3)",
    price: 156.16,
  },
  {
    _id: "66a0d9f4a0eb8627cc6323f3",
    name: "CB:Training STD(15_037_0117_1_3)",
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
    providerName: "Provider 1",
    termsAndConditions: [
      {
        heading: "Term 1",
        paragraph: "This is the first term.",
      },
    ],
    services: ["66a0d9f4a0eb8627cc6320f9", "66a0d9f4a0eb8627cc6321f0"],
    notes: "Provider 1 notes.",
    linkedCustomers: ["66a0d9f4a0eb8627cc6320f4", "66a0d9f4a0eb8627cc6320f5"],
    serviceAgreements: [],
    createdAt: "2023-09-04T12:00:00Z",
    updatedAt: "2023-09-04T12:00:00Z",
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
    termsAndConditions: [
      {
        heading: "Term 1",
        paragraph: "This is the first term for Provider 2.",
      },
    ],
    services: ["66a0d9f4a0eb8627cc6323f4", "66a0d9f4a0eb8627cc6323f6"],
    notes: "Provider 2 notes.",
    linkedCustomers: ["66a0d9f4a0eb8627cc6320f4", "66a0d9f4a0eb8627cc6320f5"],
    serviceAgreements: [],
    createdAt: "2023-09-04T12:00:00Z",
    updatedAt: "2023-09-04T12:00:00Z",
  },
];

const customerSeed = [
  {
    _id: "66a0d9f4a0eb8627cc6320f4",
    user: "66a083826e76d0e5ababe491",
    serviceAgreementEmail: "charlie.agreement@example.com",
  },
  {
    _id: "66a0d9f4a0eb8627cc6320f5",
    user: "66a083826e76d0e5ababe494",
    serviceAgreementEmail: "frank.agreement@example.com",
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

module.exports = {
  userSeed,
  customerSeed,
  providerSeed,
  productSeed,
  serviceSeed,
  shiftSeed,
  agreementSeed,
};
