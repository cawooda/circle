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
        referenceNumber
        referenceName
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
      }
      roleCustomer {
        _id
        user {
          _id
          fullName
          first
          last
        }
        referenceNumber
        referenceName
        address
        dateOfBirth
        customerSpecificField
      }
      roleSuperAdmin
      serviceAgreements {
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
          user {
            _id
            first
            last
          }
          referenceNumber
          referenceName
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
        service {
          _id
          product {
            name
            _id
            price
          }
          price
          provider {
            _id
          }
        }
        quantity
        endDate
        totalPrice
        approvedByCustomer
        createdAt
        updatedAt
        signature
      }
    }
  }
`;

export const QUERY_CUSTOMERS = gql`
  query Query {
    getCustomers {
      _id
      referenceNumber
      referenceName
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
        referenceNumber
        referenceName
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

export const QUERY_SERVICE_AGREEMENTS = gql`
  query GetServiceAgreements {
    getServiceAgreements {
      success
      message
      serviceAgreements {
        _id
        provider {
          _id
        }
        customer {
          _id
          user {
            _id
            fullName
          }
          referenceNumber
          referenceName
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
        service {
          _id
          product {
            name
            _id
          }
          price
        }
        quantity
        endDate
        totalPrice
        approvedByCustomer
        createdAt
        updatedAt
        signature
      }
    }
  }
`;
