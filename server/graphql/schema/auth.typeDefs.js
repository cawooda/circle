const userTypeDefs = `
    extend type Mutation {
        login(contact:ContactInput!,password:String!): LoginResponse!
        logout: ActionResponse!
        passwordReset(contact:ContactInput!):ActionResponse!
        updatePassword(update:UpdatePasswordInput!):ActionResponse!
    }    
    type LoginResponse {
        success:Boolean!
        message:String!
        token:String
    }
    input UpdatePasswordInput {
        password:String!
    }
    

`;

module.exports = userTypeDefs;
