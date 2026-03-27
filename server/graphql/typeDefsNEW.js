const typeDefs = `
scalar DateTime
    @specifiedBy(url: "https://scalars.graphql.org/andimarek/date-time")

scalar Token

type Contact {
    email:String
    mobile: String
    phone: String
    address: Address
}

type Address:{
    street: String!
    city: String!
    postcode: String!
}


type Product{
    _id:ID!
    name!
    code!
    maxPrice!
}

type Service{
    provider:Provider
    product: Product
    price: Float!
}

type Travel{
    startTime:DateTime
    endTime: DateTime
    customer:Customer
    provider:Provider
    kilometres: int!
    rate: float! 
    total: float!
}

type Booking{
    _id:ID
    customer:Customer!
    provider:Provider!
    staff: UserID!
    service:Serivce! 
    startTime:DateTime!
    endTime:DateTime!
    hours: Float!
}

type Shift{
    provider:provider
    staff: UserID
    customer
    startTime
    endTime
    service
    [travel]
}

type LineItemComponent {
    travel:Travel
    service: Service
}

type LineItem {
    date:DateTime
    lineItemComponent: LineItemComponent 
}

type Invoice {
    _id:ID
    date: DateTime!
    lineItem: LineItem!
    Tax: Float!
    Total: Float!
    DueDate: DateTime
    Terms: int!
    Paid: Float!


type Conversation {
    _id:ID!
    startDate:DateTime!
    endDate:DateTime!
    messages[Message]
}

type Message {
    Conversation:ID!
    Text: String!
    Timestamp: DateTime!
    Archived: Boolean
    Deleted: Boolean
    [ReadbyUsers]
}

type PlannedService {
    service: Service!
    units: float!
    startDate:DateTime!
    endDate: DateTime!
    TotalCost: Float!
}

type Approval {
    _id:ID!
    dateSigned: DateTime!
    conversation:Conversation
    plannedService:PlannedService
    expiry:DateTime!
    signature:String!
}

type Agreement{
    provider:Provider!
    customer:Customer!
    approval: Approval
    [Messages]
    [Service]
}

type Billing {
    Contact:Contact
    Provider:Provider
}

type Customer{
    _id:ID
    UserID
    Billing:Billing    
    [Agreements]
}

type TermsAndConditions{
    Heading:String!
    Description:String!
}

type Provider{
    _id:ID!
    Name:String!
    Users:[User!]
    Contact: Contact!
    Description: String!
    TermsAndConditions: [TermsAndConditions!]
    Agreements
    [Service]
}

type User{
    _id:ID!
    first:String
    last:String
    Contact:Contact
    Date of birth
    Customer
    Provider
    Admin
}

type Review{
    Provider
    Date
    Stars
    PrivateMessage 
    [Tags]
}

Conversations
[Users]

input Credentials {
    contact:Contact!
    password: String!
}

Defaults
[Product]

type Queries{
    GetMe
    GetAgreement
}



type Mutation {
    Adduser
    VerifyAuthCode
    UodatePassword
    login(credentials:Credentials): User!
    Logout
    UodateUserProfile
    RegisterCustomer
    RegisterProvider
    RegisterAdmin
    CreateAgreement
    SignAgreement
}

`;
