import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
  from,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { UserProvider } from "./contexts/UserContext";
import { jwtDecode } from "jwt-decode";

// Create an HTTP link to connect to the GraphQL server
const httpLink = createHttpLink({
  uri: "/graphql", // The URI of the GraphQL endpoint
  cache: new InMemoryCache(), // Initialize a new in-memory cache for Apollo Client
});

// Create an error link to handle GraphQL and network errors
const errorLink = onError(({ graphQLErrors, networkError }) => {
  // Check if there are GraphQL errors
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      console.error(`[GraphQL error]: ${err.message}`); // Log GraphQL errors
    }
  }
  // Check if there are network errors
  if (networkError) {
    console.error(`[Network error]: ${networkError}`); // Log network errors
  }
});

// Create the Apollo Client instance for unauthenticated components
const unauthenticatedClient = new ApolloClient({
  // Combine the errorLink and httpLink (without authLink)
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(), // Use a new in-memory cache
});

function ServiceSign() {
  return (
    <>
      <ApolloProvider client={unauthenticatedClient}>
        <ChakraProvider>
          <UserProvider>
            <Outlet />
          </UserProvider>
        </ChakraProvider>
      </ApolloProvider>
    </>
  );
}

export default ServiceSign;
