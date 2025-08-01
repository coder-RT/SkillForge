import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { schema } from './schema.js'; // import the nexus schema

// Create the Apollo Server with Nexus schema
const server = new ApolloServer({
    schema,
})

// Start the server
const { url } = await startStandaloneServer(server);
console.log(`Server ready at ${url}`);
