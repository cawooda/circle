const commonTypeDefs = `
type ActionResponse {
        success: Boolean!
        message: String!
    }

type Contact {
    email:String
    mobile:String
}

type Address {
    street: String
    city: String
    postcode: String
}

input ContactInput {
        mobile: String
        email: String
    }    

`;
module.exports = commonTypeDefs;
