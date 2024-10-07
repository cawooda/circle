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

export const ADD_CUSTOMER = gql`
  mutation AddCustomer(
    $token: String!
    $providerId: ID!
    $first: String!
    $last: String!
    $mobile: String!
    $email: String!
    $invoiceEmail: String!
    $referenceNumber: String!
    $referenceName: String!
    $datOfBirth: String!
  ) {
    addCustomer(
      token: $token
      providerId: $providerId
      first: $first
      last: $last
      mobile: $mobile
      email: $email
      invoiceEmail: $invoiceEmail
      referenceNumber: $referenceNumber
      referenceName: $referenceName
      datOfBirth: $datOfBirth
    ) {
      _id
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
    $logoUrl: String
  ) {
    updateProviderProfile(
      userId: $userId
      providerId: $providerId
      providerName: $providerName
      abn: $abn
      termsAndConditions: $termsAndConditions
      address: $address
      logoUrl: $logoUrl
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
    $service: ID!
    $quantity: Int!
    $providerSignature: String!
  ) {
    addServiceAgreement(
      provider: $provider
      customer: $customer
      startDate: $startDate
      endDate: $endDate
      service: $service
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
      service {
        _id
        product {
          name
        }
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
      success
      message
      agreementNumber
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateServicePrice($serviceId: ID!, $price: Float!) {
    updateServicePrice(serviceId: $serviceId, price: $price) {
      price
    }
  }
`;
export const DELETE_SERVICE = gql`
  mutation DeleteService($serviceId: ID!) {
    deleteService(serviceId: $serviceId) {
      _id
    }
  }
`;

export const ADD_SERVICE = gql`
  mutation AddService($providerId: ID!, $productId: ID!) {
    addService(providerId: $providerId, productId: $productId) {
      success
      message
      service {
        _id
      }
    }
  }
`;
