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
    user: User
    fullName: String
    first: String
    last: String
    referenceNumber: String
    referenceName: String
    address: Address
    dateOfBirth: String
    customerSpecificField:String
}

type Provider {
    _id: ID!
    user: User
    providerName: String
    abn: String
    address: Address
    termsAndConditions: [TermsAndConditions]
    createdAt: String
    updatedAt: String
    notes:String
    linkedCustomers: [Customer]
    services: [Service]
    serviceAgreements: [ServiceAgreement]
    shifts: [Shift]!
    logoUrl: String
}

type ServiceAgreement {
    _id: ID!
    provider: Provider
    customer: Customer
    agreementNumber:Int
    startDate: String
    service: Service
    quantity: Int
    endDate: String
    totalPrice:Float
    approvedByCustomer:Boolean
    createdAt:String
    updatedAt:String
    signature:String
  }

type signServiceAgreementResponse {
success: Boolean!
message: String!
agreementNumber: Int
}

type Admin {
    _id: ID!
    user: User!
    createdAt: String
    updatedAt: String
}




type Shift {
    _id:ID
    provider: Provider
    customer: Customer
    service: Service
    startTime: String
    endTime: String
    units: Float
    createdAt: String
    updatedAt: String

}

 type ServiceAgreement {
    _id: ID!
    provider: Provider
    customer: Customer
    agreementNumber:Int
    startDate: String
    service: Service
    quantity: Int
    endDate: String
    totalPrice:Float
    approvedByCustomer:Boolean
    createdAt:String
    updatedAt:String
    signature:String
  }
  
  type Address {
    street: String
    city: String
    state: String
    postalCode: String
}

input AddressInput {
    street: String
    city: String
    state: String
    postalCode: String
}

  
 input ServiceAgreementInput {
    provider: ID!
    customer: ID!
    quantity: Int!
    endDate: String
    # Add any other fields here
  }

type Product {
  _id: ID!
  name: String
  price: Float
}

type ProductListResponse {
  success: Boolean!
  message: String!
  products: [Product]
  }

type Service {
 _id: ID!
 product: Product!
 price: Float!
 provider: Provider
 active: Boolean
}

type ServicesResponse {
  success: Boolean!
  message: String!
  services: [Service]
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

input TermsAndConditionsInput {
    heading: String
    paragraph: String
}

union RoleModel = Admin | Provider | Customer

type Query {
    getAllUsers(id: ID!): [User]
    getUserByToken(token: String!): User
    getMe(token:String!): User!
    getMyProvider: Provider!
    getUserRoles(id: ID!): [String]
    getCustomers: [Customer]
    getProducts: ProductListResponse
    getServices(providerId: ID!): ServicesResponse
    getServiceAgreements: ServiceAgreementResponse!
    getServiceAgreement(agreementNumber: String!): ServiceAgreement
}


type Mutation {
    addServiceAgreement(provider:ID!,customer:ID!,endDate:String!,startDate:String!,service:ID!,quantity:Int!,providerSignature:String!): ServiceAgreement
    signServiceAgreement(agreementId:ID!,customerSignature:String!):signServiceAgreementResponse    
    toggleUserRole(userId: ID!,role: String!): User!  
    updateProfile( userId:ID!, first: String, last: String, mobile: String,email: String):User  
    updateProviderProfile(
        userId: ID!,
        providerId: ID!,
        providerName: String,
        abn: String,
        termsAndConditions: [TermsAndConditionsInput],
        address: AddressInput
        logo:String
    ): Provider
    updateUserPassword(userId:ID!,password:String):User
    addCustomer(token:String!,
      providerId:ID!,
      first:String!,
      last:String!,
      mobile:String!,
      email:String!,
      invoiceEmail:String!,
      referenceNumber:String!,
      referenceName:String!,
      datOfBirth:String!):Customer
    addService(providerId: ID!, productId: ID!):AddServiceResponse
    deleteService(serviceId:ID!):Service
    updateServicePrice(serviceId:ID!,price: Float!):Service
}

`;

module.exports = typeDefs;
