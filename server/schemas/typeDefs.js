const typeDefs = `

scalar DateTime
  @specifiedBy(url: "https://scalars.graphql.org/andimarek/date-time")

scalar Token


input AddUser {
  contact: ContactInput  
}

input PaswordReset{
  contact:ContactInput!
}

type PasswordResetResponse{
  success:Boolean!
  message:String!
}

input UpdatePassword{
  authCode: String
  newPassword: String
}

type UpdatePasswordResponse {
  success:Boolean!
  message:String!
}

input ContactInput {
  email: String
  mobile: String
}

type Contact {
    mobile: String
    email: String
}

type User {
    _id: ID!
    first: String!
    last: String!
    contact: Contact
    dateOfBirth: DateTime
    admin: Admin
    provider: Provider
    customer: Customer
    superAdmin: Boolean
    serviceAgreements: [ServiceAgreement]
}

input PaswordReset{
  contact:ContactInput!
}

type PasswordResetResponse{
  success:Boolean!
  message:String!
}

type PasswordReset {
  userId:ID!
  complete:Boolean!
  requestCode:String!
}

type Admin {
    users: [User]!
    createdAt: DateTime!
    updatedAt: DateTime!
}

type Customer {
    active: Boolean!
    dateOfBirth: DateTime
    referenceNumber: String
    referenceName: String
    address: Address!
    invoiceEmail: String
    serviceAgreementEmail: String
    customerSpecificField: String
    serviceAgreements: [ServiceAgreement]
    createdAt: DateTime!
    updatedAt: DateTime!
}

type Provider {
    providerName: String!
    abn: String!
    address: Address!
    termsAndConditions: [TermsAndConditions]
    createdAt: DateTime!
    updatedAt: DateTime!
    notes:String
    linkedCustomers: [User]
    services: [Service]
    serviceAgreements: [ServiceAgreement]
    shifts: [Shift]
    logoUrl: String
}

type TermsAndConditions {
    heading: String!
    paragraph: String!
}

type Product {
  _id: ID!
  name: String
  defaultPrice: Float
}

type Service {
 _id: ID!
 product: Product!
 price: Float!
 provider: User
 active: Boolean
}

type SignServiceAgreementResponse {
success: Boolean!
message: String!
agreementNumber: Int
}

type Shift {
    _id:ID!
    provider: User!
    customer: User!
    service: Service!
    startTime: String!
    endTime: String!
    units: Float!
    createdAt: DateTime!
    updatedAt: DateTime!

}

type ServiceAgreement {
    _id: ID!
    provider: User!
    customer: User!
    agreementNumber:Int!
    startDateTime: DateTime!
    service: Service!
    quantity: Int!
    endDateTime: DateTime!
    totalPrice:Float
    approvedByCustomer:Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
    signature:String
  }


  
  type Address {
    street: String!
    city: String!
    state: String!
    postalCode: String!
}





input AddUserInput {
    first: String!
    last: String!
    mobile: String!
    email: String!
    password: String!
    dateOfBirth: DateTime!
}

input UpdateUserProfileInput {
    userId: ID!
    first: String
    last: String
    mobile: String
    email: String
    dateOfBirth: DateTime
}

type LoginUserResponse {
    success: Boolean!
    message: String!
    token: String
    user: User
}

input AddressInput {
    street: String
    city: String
    state: String
    postalCode: String
    }

input UpdateTermsAndConditionsInput {
    heading: String!
    paragraph: String!
}    

input UpdateProviderProfileInput {
    userId: ID!
    providerName: String
    abn: String
    address: AddressInput
    termsAndConditions: [UpdateTermsAndConditionsInput]
    notes:String
    logoUrl: String
}

type UpdateProviderProfileResponse {
    success: Boolean!
    message: String!
    provider: Provider
}

input AddNewCustomerToProviderInput {
    providerUserId: ID!
    invoiceEmail: String!
    serviceAgreementEmail: String!
    referenceNumber: String!
    referenceName: String!
    dateOfBirth: DateTime!
    address: AddressInput!
    customerSpecificField: String
}
    
input UpdateAddressInput {
    street: String
    city: String
    state: String
    postalCode: String
}
  
 input ServiceAgreementInput {
    provider: ID!
    customer: ID!
    endDateTime: DateTime!
    startDateTime: DateTime!
    service: ID!
    quantity: Int!
    providerSignature: String!
  }

input SignServiceAgreementInput {
  agreementNumber: Int!
  customerSignature: String!
}

input TermsAndConditionsInput {
  heading: String!
  paragraph: String!
}

type AddUserResponse {
    success: Boolean!
    message: String!
    user: User
}

type UpdateUserProfileResponse {
    success: Boolean!
    message: String!
    user: User
}

type UpdateUserPasswordResponse {
    success: Boolean!
    message: String!
}

type UpdateServicePriceResponse {
  success: Boolean!
  message: String!
  service: Service
}

type ProductListResponse {
  success: Boolean!
  message: String!
  products: [Product]
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

type AddNewCustomerToProviderResponse {
  success: Boolean!
  message: String!
  customer: User
}

type DeleteServiceResponse {
  success: Boolean!
  message: String!
}

type ServiceAgreementResponse {
  success: Boolean!
  message: String!
  serviceAgreements: [ServiceAgreement]!
}

type UpdateServiceResponse {
  success: Boolean!
  message: String!
  service: Service
}

type LoginResponse {
  success: Boolean!
  message: String!
  user: User
  token: Token
}

type GetMeResponse {
  success: Boolean!
  message: String!
  user: User
  token: Token
}

type Query {
    getMe: GetMeResponse!
    getAllUsers: [User]
    getAllProducts: ProductListResponse
    getAllProviderServices(providerId: ID!): ServicesResponse
    getAllProviderServiceAgreements: ServiceAgreementResponse!
    getServiceAgreement(agreementNumber: String!): ServiceAgreement
}





type Mutation {
    passwordReset(contact:ContactInput): PasswordResetResponse!    
    updatePassword(update:UpdatePassword):UpdatePasswordResponse!
    login(contact:ContactInput,password:String): LoginResponse!
    addUser(input : AddUserInput!): AddUserResponse!
    addServiceAgreement(input: ServiceAgreementInput!): ServiceAgreement
    signServiceAgreement(input: SignServiceAgreementInput):SignServiceAgreementResponse    
    toggleUserRole(userId: ID!,role: String!): User!  
    updateUserProfile(input: UpdateUserProfileInput!):UpdateUserProfileResponse  
    updateUserPassword(password:String):UpdateUserPasswordResponse
    updateProviderProfile(input: UpdateProviderProfileInput!): UpdateProviderProfileResponse
    addNewCustomerToProvider(input: AddNewCustomerToProviderInput!):AddNewCustomerToProviderResponse
    addServiceToProvider(providerUserId: ID!, productId: ID!):AddServiceResponse
    deleteServiceFromProvider(serviceId:ID!):DeleteServiceResponse
    updateServicePrice(serviceId:ID!,price: Float!):UpdateServicePriceResponse
}

`;

module.exports = typeDefs;
