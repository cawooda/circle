import { gql } from "@apollo/client";

export const QUERY_USER_BY_ID = gql`
  query Query($id: ID!) {
    getUserById(id: $id) {
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
  query Query($agreementNumber: String!) {
    getServiceAgreement(agreementNumber: $agreementNumber) {
      _id
      provider
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
      product
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
  query Query($token: String!) {
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
