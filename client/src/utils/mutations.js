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

export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword($userId: ID!, $password: String) {
    updateUserPassword(userId: $userId, password: $password) {
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
        address {
          street
          city
          state
          postalCode
        }
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
        referenceNumber
        referenceName
        address {
          street
          city
          state
          postalCode
        }
        dateOfBirth
        customerSpecificField
      }
      roleSuperAdmin
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateProfile(
    $userId: ID!
    $first: String
    $last: String
    $mobile: String
    $email: String
  ) {
    updateProfile(
      userId: $userId
      first: $first
      last: $last
      mobile: $mobile
      email: $email
    ) {
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
        address {
          street
          city
          state
          postalCode
        }
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
        referenceNumber
        referenceName
        address {
          street
          city
          state
          postalCode
        }
        dateOfBirth
        customerSpecificField
      }
      roleSuperAdmin
    }
  }
`;

export const UPDATE_PROVIDER_PROFILE = gql`
  mutation UpdateProviderProfile(
    $userId: ID!
    $providerId: ID!
    $providerName: String
    $abn: String
    $termsAndConditions: [TermsAndConditionsInput]
    $address: AddressInput
  ) {
    updateProviderProfile(
      userId: $userId
      providerId: $providerId
      providerName: $providerName
      abn: $abn
      termsAndConditions: $termsAndConditions
      address: $address
    ) {
      _id
      updatedAt
    }
  }
`;

export const TOGGLE_USER_ROLE = gql`
  mutation Mutation($userId: ID!, $role: String!) {
    toggleUserRole(userId: $userId, role: $role) {
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
        address {
          street
          city
          state
          postalCode
        }
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
        referenceNumber
        referenceName
        address {
          street
          city
          state
          postalCode
        }
        dateOfBirth
        customerSpecificField
      }
      roleSuperAdmin
    }
  }
`;

export const ADD_SERVICE_AGREEMENT = gql`
  mutation AddServiceAgreement(
    $provider: ID!
    $customer: ID!
    $startDate: String!
    $endDate: String!
    $product: String!
    $quantity: Int!
    $providerSignature: String!
  ) {
    addServiceAgreement(
      provider: $provider
      customer: $customer
      startDate: $startDate
      endDate: $endDate
      product: $product
      quantity: $quantity
      providerSignature: $providerSignature
    ) {
      _id
      provider {
        _id
        providerName
        address {
          street
          city
          state
          postalCode
        }
      }
      customer {
        _id
        user {
          _id
          first
          mobile
          __typename
        }
        referenceNumber
        referenceName
        address {
          street
          city
          state
          postalCode
        }
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
  mutation signServiceAgreement(
    $agreementId: ID!
    $customerSignature: String!
  ) {
    signServiceAgreement(
      agreementId: $agreementId
      customerSignature: $customerSignature
    ) {
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
        address {
          street
          city
          state
          postalCode
        }
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
        referenceNumber
        referenceName
        address {
          street
          city
          state
          postalCode
        }
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

export const ADD_SERVICE = gql`
  mutation AddService($providerId: ID!, $productId: ID!, $price: Float!) {
    addService(providerId: $providerId, productId: $productId, price: $price) {
      message
      service {
        _id
        product {
          _id
          name
          price
        }
        price
        provider {
          _id
          user {
            _id
            fullName
          }
          abn
          address {
            street
            city
            state
            postalCode
          }
          providerName
          createdAt
          updatedAt
        }
      }
      success
    }
  }
`;
