const userTypeDefs = `
    type User {
    _id: ID!
    first: String
    last: String
    contact: Contact
    dateOfBirth: DateTime
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
