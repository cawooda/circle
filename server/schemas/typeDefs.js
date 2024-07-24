const typeDefs = `

type User {
    _id: ID!
    first: String
    last: String
    mobile: String
    email: String
    date_of_birth: String
    fullName: String
    roleAdmin: Admin
    roleProvider: Provider
    roleCustomer: Customer
}

enum RoleType {
    CUSTOMER
    PROVIDER
    ADMIN
    SUPERADMIN
}

type Admin {
    _id: ID!
    user: User!
    createdAt: String
    updatedAt: String
}

type Provider {
    _id: ID!
    user: User!
    abn: String
    address: String
    providerName: String
    termsAndConditions: [TermsAndConditions]
    createdAt: String
    updatedAt: String
}

type Customer {
    _id: ID!
    user: ID!
    ndisNumber: String
    address: String
    dateOfBirth: String
    customerSpecificField:String
}

type TermsAndConditions {
    heading: String
    paragraph: String
}

union RoleModel = Admin | Provider | Customer

type Query {
    getAllUsers: [User]
    getUserByToken(token: String!): User
    getUserById(id: ID!): User
    getUserRoles(id: ID!): [String]
}

type Mutation {
    addUser(first: String!, last: String!, mobile: String, email: String!, password: String!): User
    loginUser(mobile: String, email: String!, password: String!): User
    toggleUserRole(userId: ID!, role: RoleType!): User!
    createAdmin(userId: ID!): Admin!
    createProvider(userId: ID!, abn: String!, address: String!, providerName: String!): Provider!
}

`;

module.exports = typeDefs;
