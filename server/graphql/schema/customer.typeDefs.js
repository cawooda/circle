const customerTypeDefs = `
    type Customer {
    user:User!
    serviceAgreementEmail: String
    invoiceEmail: String
    referenceNumber: String
    referenceName: String
    address: Address
    customerSpecificField: String
    
}

`;

module.exports = customerTypeDefs;
