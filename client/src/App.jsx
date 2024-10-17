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

import RootLayout from "./layouts/RootLayout";
import { UserProvider } from "./contexts/UserContext";

import { jwtDecode } from "jwt-decode";
import AuthService from "./utils/auth";

const authLink = setContext((_, { headers }) => {
  const token = AuthService.getToken();
  console.log("token in authlink", token);
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ``,
    },
  };
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case "UNAUTHENTICATED":
          // Handle token expiration error
          if (err.message === "Token expired") {
            AuthService.logout(); // Optionally log out the user
            // Or handle token refresh if applicable
          }
          break;
        default:
          console.error(`[GraphQL error]: ${err.message}`);
      }
    }
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = createHttpLink({
  uri: "/graphql",
});

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <>
      <ApolloProvider client={client}>
        <ChakraProvider>
          <UserProvider>
            <RootLayout />
          </UserProvider>
        </ChakraProvider>
      </ApolloProvider>
    </>
  );
}

export default App;
