import {
    ApolloClient,
    InMemoryCache,
    createHttpLink,
    from,
} from "@apollo/client";

const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URL,
});

// create Apollo Client
const client = new ApolloClient({
    link: from([httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: "no-cache",
            errorPolicy: "ignore",
        },
        query: {
            fetchPolicy: "no-cache",
            errorPolicy: "all",
        },
    },
});

export default client;