const adminTypeDefs = `
    type Admin {
    user:User!
    users:[User]
}

`;

module.exports = adminTypeDefs;
