// src/graphql/schema/index.js

const authTypeDefs = require("./auth.typeDefs");
const userTypeDefs = require("./user.typeDefs");
// const adminTypeDefs = require("./admin.typeDefs");
// const providerTypeDefs = require("./provider.typeDefs");
// const customerTypeDefs = require("./customer.typeDefs");
const scalarTypeDefs = require("./scalars");
const commonTypeDefs = require("./common.typeDefs");

const rootTypeDefs = `
  type Query
  type Mutation
`;

module.exports = [
  rootTypeDefs,
  scalarTypeDefs,
  authTypeDefs,
  userTypeDefs,
  // adminTypeDefs,
  // customerTypeDefs,
  // providerTypeDefs,
  commonTypeDefs,
];
