import { gql } from "@apollo/client";

export const QUERY_ALL_USERS = gql`
  query getAllUsers($id: ID!) {
    getAllUsers(id: $id) {
      _id
      first
      last
      mobile
      email
      date_of_birth
      fullName
      roleAdmin {
        _id
        createdAt
        updatedAt
      }
      roleProvider {
        _id
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
      roleCustomer {
        _id
        ndisNumber
        address
        dateOfBirth
        customerSpecificField
      }
      roleSuperAdmin
    }
  }
`;

export const QUERY_USER_BY_ID = gql`
  query GetMe($id: ID!) {
    getMe(id: $id) {
      _id
      first
      last
      mobile
      email
      date_of_birth
      fullName
      roleProvider {
        _id
        abn
      }
      roleCustomer {
        _id
        ndisNumber
        address
        dateOfBirth
        customerSpecificField
      }
      roleSuperAdmin
    }
  }
`;

export const QUERY_CUSTOMERS = gql`
  query Query {
    getCustomers {
      _id
      ndisNumber
      address
      dateOfBirth
      customerSpecificField
      user {
        _id
        first
        last
        mobile
        email
        date_of_birth
        fullName
      }
    }
  }
`;

export const QUERY_PRODUCTS = gql`
  query getProducts {
    getProducts {
      _id
      name
      price
    }
  }
`;

export const QUERY_SERVICE_AGREEMENT = gql`
  query getServiceAgreement($agreementNumber: String!) {
    getServiceAgreement(agreementNumber: $agreementNumber) {
      _id
      provider {
        _id
        user {
          _id
          first
          last
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
        address
        ndisNumber
        user {
          first
          last
          mobile
          _id
        }
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

export const QUERY_USER_BY_TOKEN = gql`
  query getUserByToken($token: String!) {
    getUserByToken(token: $token) {
      _id
      first
      last
      date_of_birth
      mobile
      email
      createdAt
      updatedAt
      fullName
      isAdmin
      isCustomer
      isProvider
    }
  }
`;

// export const QUERY_LINKED_PROVIDERS = gql`
//   query getLinkedProvideres($userId: ID!) {

//   }
// `;
