const typeDefs = `
  type User {
    _id: ID!
    token:String!
    first: String!
    last: String!
    mobile: String
    email: String
    date_of_birth: String
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
    getUserByToken(token:String!):User
    getUserById(_id:ID!):User
    getUserRoles(_id:ID!):User
}

type Mutation {
    addUser(first: String!, last: String!, mobile: String, email: String!, password: String!): User
    loginUser(mobile:String, email:String!, password:String!):User
    toggleUserRole(userId:ID!,role:String) : User!
    createAdmin(userId: ID!): Admin!
}
`;

module.exports = typeDefs;
