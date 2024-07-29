import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation addUser(
    $first: String!
    $last: String
    $email: String!
    $password: String!
  ) {
    createUser(first: $first, last: $last, email: $email, password: $password) {
      _id
      token
      first
      last
      mobile
      email
      date_of_birth
      fullName
    }
  }
`;

export const ADD_SERVICE_AGREEMENT = gql`
  mutation AddServiceAgreement(
    $provider: ID!
    $customer: ID!
    $endDate: String!
    $product: String!
    $quantity: Int!
  ) {
    addServiceAgreement(
      provider: $provider
      customer: $customer
      endDate: $endDate
      product: $product
      quantity: $quantity
    ) {
      _id
      provider {
        _id
        providerName
        address
      }
      customer {
        _id
        user {
          _id
          first
          mobile
          __typename
        }
        ndisNumber
        address
        dateOfBirth
        customerSpecificField
        __typename
      }
      agreementNumber
      startDate
      product {
        _id
        name
        price
      }
      quantity
      endDate
      totalPrice
      approvedByCustomer
      createdAt
      updatedAt
      __typename
    }
  }
`;
