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

 type ServiceAgreement {
    _id: ID
    provider: ID
    customer: Customer
    agreementNumber:Int
    startDate: String
    product: ID
    quantity: Int
    endDate: String
    totalPrice:Float
    approvedByCustomer:Boolean
    createdAt:String
    updatedAt:String
  }
  

 input ServiceAgreementInput {
    provider: ID!
    customer: ID!
    product: ID!
    quantity: Int!
    endDate: String
    # Add any other fields here
  }

type Product {
  _id: ID
  name: String
  price: Float
}

input ProductInput {
  product: ID!
  quantity: Int!
}

type Customer {
    _id: ID!
    user: User
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
    getCustomers: [Customer]
    getProducts: [Product]
    getServiceAgreements: [ServiceAgreement!]
    getServiceAgreement(agreementNumber: String!): ServiceAgreement
}


type Mutation {
    addUser(first: String!, last: String!, mobile: String, email: String!, password: String!): User
    loginUser(mobile: String, email: String!, password: String!): User
    toggleUserRole(userId: ID!, role: RoleType!): User!
    createAdmin(userId: ID!): Admin!
    createProvider(userId: ID!, abn: String!, address: String!, providerName: String!): Provider!
    addServiceAgreement(provider:ID!,customer:ID!,endDate:String!,product:String!,quantity:Int!): ServiceAgreement
}

`;

module.exports = typeDefs;
