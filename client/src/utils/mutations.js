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

export const SIGN_SERVICE_AGREEMENT = gql`
  mutation SignServiceAgreement($agreementId: ID!, $signature: String!) {
    signServiceAgreement(agreementId: $agreementId, signature: $signature) {
      _id
      provider {
        _id
        user {
          _id
          first
          last
          mobile
          email
          date_of_birth
          fullName
        }
        abn
        address
        providerName
        termsAndConditions {
          heading
          paragraph
        }
        createdAt
        updatedAt
      }
      customer {
        _id
        user {
          first
          _id
          email
          mobile
        }
        ndisNumber
        address
        dateOfBirth
        customerSpecificField
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
    }
  }
`;
