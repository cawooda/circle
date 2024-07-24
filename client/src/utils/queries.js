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
