const { ApolloServer } = require("apollo-server");
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

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
