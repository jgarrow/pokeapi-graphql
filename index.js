const { ApolloServer, gql } = require("apollo-server");
const { typeDefs } = require("./schema/typeDefs");
const { PokemonAPI } = require("./resolvers/pokemonAPI");
const { resolvers } = require("./resolvers/resolvers");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => {
        return {
            pokemonAPI: new PokemonAPI()
        };
    },
    context: () => {}
});

// server.listen(() => console.log(`Server listening on port 4000`));
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
