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
import AuthService from "./utils/auth";

const httpLink = createHttpLink({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

const authLink = setContext((_, { headers }) => {
  let token = AuthService.getToken();

  if (token) {
    const decodedToken = jwtDecode(token);
  }

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
