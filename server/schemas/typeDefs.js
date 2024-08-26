const typeDefs = `

type User {
    _id: ID!
    first: String
    last: String
    mobile: String!
    email: String
    date_of_birth: String
    fullName: String
    roleAdmin: Admin
    roleProvider: Provider
    roleCustomer: Customer
    roleSuperAdmin: Boolean
    serviceAgreements: [ServiceAgreement]
}

type Customer {
    _id: ID!
    user: User!
    ndisNumber: String
    address: String
    dateOfBirth: String
    customerSpecificField:String
}

type ServiceAgreement {
    _id: ID!
    provider: Provider
    customer: Customer
    agreementNumber:Int
    startDate: String
    product: Product
    service: Service
    quantity: Int
    endDate: String
    totalPrice:Float
    approvedByCustomer:Boolean
    createdAt:String
    updatedAt:String
    signature:String
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
    _id: ID!
    provider: Provider
    customer: Customer
    agreementNumber:Int
    startDate: String
    product: Product
    service: Service
    quantity: Int
    endDate: String
    totalPrice:Float
    approvedByCustomer:Boolean
    createdAt:String
    updatedAt:String
    signature:String
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
  _id: ID!
  name: String!
  price: Float!
}

type Service {
 _id: ID!
 product: Product!
 price: Float!
 provider: Provider
}

type AddServiceResponse {
  success: Boolean!
  message: String!
  service: Service
}

type ServiceAgreementResponse {
  success: Boolean!
  message: String!
  serviceAgreements: [ServiceAgreement]!
}

type TermsAndConditions {
    heading: String
    paragraph: String
}

union RoleModel = Admin | Provider | Customer

type Query {
    getAllUsers(id: ID!): [User]
    getUserByToken(token: String!): User
    getMe(id: ID!): User!
    getUserRoles(id: ID!): [String]
    
    getCustomers: [Customer]
    getProducts: [Product]

    getServices(providerId: ID!): [Service]
    
    getServiceAgreements: ServiceAgreementResponse!
    getServiceAgreement(agreementNumber: String!): ServiceAgreement
}


type Mutation {
    addServiceAgreement(provider:ID!,customer:ID!,endDate:String!,product:String!,quantity:Int!,providerSignature:String!): ServiceAgreement
    signServiceAgreement(agreementId:ID!,customerSignature:String!):ServiceAgreement    
    toggleUserRole(userId: ID!,role: String!): User!  
    updateProfile( userId:ID!, first: String, last: String, mobile: String,email: String):User  
    updateUserPassword(userId:ID!,password:String):User
    
    addService(providerId: ID!, productId: ID!, price: Float!):AddServiceResponse
    deleteService(serviceId:ID!):Service
    updateServicePrice(serviceId:ID!,price: Float!):Service
}

`;

module.exports = typeDefs;
