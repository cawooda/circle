import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ChakraProvider } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import { UserProvider } from "./contexts/UserContext";

const httpLink = createHttpLink({
  uri: "/graphql",
  cache: new InMemoryCache(),
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ``,
    },
  };
});

const client = new ApolloClient({
  // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
  link: authLink.concat(httpLink),
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
