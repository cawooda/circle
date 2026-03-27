const userTypeDefs = `
    type User {
    _id: ID!
    first: String
    last: String
    contact: Contact
    dateOfBirth: DateTime
    admin: Admin
    provider: Provider
    customer: Customer
    superAdmin: Boolean
}

extend type Query {
    me:MeResponse!
    user(_id:ID!):User!
}

extend type Mutation {
    updateUserProfile(input:UpdateUserProfileInput!): User!
}

type MeResponse {
    success: Boolean!
    message: String!
    user: User
}

input UpdateUserProfileInput {
    first: String
    last: String
    contact: ContactInput
    dateOfBirth: DateTime
}

`;

module.exports = userTypeDefs;
