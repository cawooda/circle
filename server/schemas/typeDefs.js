const typeDefs = `
type User {
    first:String
    last:String
    date_of_birth: String
    mobile: String
    email: String
}

type Query{
    users: User
}
`;

module.exports = typeDefs;
