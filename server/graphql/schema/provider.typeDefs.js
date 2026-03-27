const providerTypeDefs = `
    type Provider {
    user:User!
    abn: String
    address: Address
    providerName: String
    notes: String
    linkedCustomers: [Customer]
    logUrl: String
}

`;

module.exports = providerTypeDefs;
