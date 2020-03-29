const fetch = require("node-fetch");
const baseUrl = `https://pokeapi.co/api/v2`;

const resolvers = {
    Query: {
        allPokemon: (parent, args) => {
            return fetch(
                `${baseUrl}/pokemon?offset=${args.start}&limit=20`
            ).then(res => res.json());
        },
        pokemon: (parent, args, { dataSources }) => {
            return args.number;
        }
    },
    Pokemon: {
        id: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonId(parent);
        },
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonName(parent);
        },
        height: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonHeight(parent);
        },
        weight: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonWeight(parent);
        },
        nat_dex_num: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getNationalPokedexNumber(parent);
        },
        evolves_to: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getWhoPokemonEvolvesTo(parent);
        },
        evolves_from: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getWhoPokemonEvolvesFrom(parent);
        },
        evolution_criteria: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getEvolvedAtDetails(parent);
        },
        evolution_trigger: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getEvolutionTrigger(parent);
        }
    }
};

module.exports = { resolvers };
