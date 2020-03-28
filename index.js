const { ApolloServer, gql } = require("apollo-server");
const { typeDefs } = require("./schema/typeDefs");
const { resolvers } = require("./resolvers/resolvers");

// const typeDefs = gql`
//     type Book {
//         title: String
//         author: String
//     }

//     type Query {
//         books: [Book]
//     }
// `;

// const books = [
//     {
//         title: "Harry Potter and the Chamber of Secrets",
//         author: "J.K. Rowling"
//     },
//     {
//         title: "Jurassic Park",
//         author: "Michael Crichton"
//     }
// ];

// const resolvers = {
//     Query: {
//         books: () => books
//     }
// };

const server = new ApolloServer({ typeDefs, resolvers });

// server.listen(() => console.log(`Server listening on port 4000`));
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
