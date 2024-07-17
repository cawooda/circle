const typeDefs = `
  type User {
    _id: ID!
    first: String!
    last: String!
    date_of_birth: String
    mobile: String
    email: String
    createdAt: String
    updatedAt: String
    fullName: String
  }

type Admin {
    _id: ID!
    user: User!
    createdAt: String
    updatedAt: String
  }

type Query{
    getAllUsers:[User]
    getUserById(_id:ID!):User
    getAdminByUserId(userId:ID!): Admin
}

type Mutation {
    createUser(first: String!, last: String!, date_of_birth: String, mobile: String, email: String!, password: String!): User
    createAdmin(userId: ID!): Admin
}
`;

module.exports = typeDefs;
