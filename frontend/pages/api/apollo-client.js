import { ApolloClient, InMemoryCache } from "@apollo/client";

// initialize the client connection

const client = new ApolloClient({
  uri: "http://localhost:8000/graphql",
  cache: new InMemoryCache(),
});

export default client;
