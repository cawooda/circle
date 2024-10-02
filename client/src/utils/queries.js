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

export const GET_ME = gql`
  query GetMe($token: String!) {
    getMe(token: $token) {
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
        termsAndConditions {
          heading
          paragraph
        }
        services {
          _id
          price
          product {
            name
          }
        }
        linkedCustomers {
          _id
          user {
            _id
            first
            last
          }
        }
        address {
          street
          city
          state
          postalCode
        }
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
            _id
            first
            last
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

export const GET_MY_PROVIDER = gql`
  query GetMyProvider {
    getMyProvider {
      _id
      user {
        _id
        first
        last
        mobile
        email
        date_of_birth
        fullName
        roleProvider {
          _id
        }
        roleCustomer {
          _id
        }
        roleSuperAdmin
        serviceAgreements {
          _id
        }
        roleAdmin {
          _id
        }
      }
      providerName
      abn
      address {
        street
        city
        state
        postalCode
      }
      termsAndConditions {
        heading
        paragraph
      }
      createdAt
      updatedAt
      notes
      linkedCustomers {
        _id
        user {
          _id
          fullName
        }
        fullName
        first
        last
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
      services {
        _id
        product {
          _id
          name
          price
        }
        price
        provider {
          _id
        }
        active
      }
      serviceAgreements {
        _id
        provider {
          _id
        }
        customer {
          _id
          user {
            _id
            first
            fullName
            last
          }
        }
        agreementNumber
        startDate
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
            abn
            address {
              street
              city
              state
              postalCode
            }
            providerName
            notes
            user {
              _id
              fullName
            }
          }
          active
        }
        quantity
        endDate
        totalPrice
        approvedByCustomer
        createdAt
        updatedAt
        signature
      }
      shifts {
        _id
        provider {
          _id
          providerName
        }
        customer {
          _id
          fullName
        }
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
          }
          active
        }
        startTime
        endTime
        units
        createdAt
        updatedAt
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
      address {
        street
        city
        state
        postalCode
      }
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
  query GetProducts {
    getProducts {
      success
      message
      products {
        _id
        name
        price
      }
    }
  }
`;
export const QUERY_SERVICES = gql`
  query GetServices($providerId: ID!) {
    getServices(providerId: $providerId) {
      success
      message
      services {
        _id
        active
        product {
          _id
          name
          price
        }
        price
      }
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
        address {
          street
          city
          state
          postalCode
        }
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
