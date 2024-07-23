import { gql } from "@apollo/client";

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

export const QUERY_LINKED_PROVIDERS = gql`
  query getLinkedProvideres($userId: ID!) {
    
    
  }
`;
