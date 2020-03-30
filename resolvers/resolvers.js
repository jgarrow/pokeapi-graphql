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
        attack: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAttackStat(parent);
        },
        defense: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getDefenseStat(parent);
        },
        speed: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getSpeedStat(parent);
        },
        special_attack: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getSpecialAttackStat(parent);
        },
        special_defense: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getSpecialDefenseStat(parent);
        },
        hp: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getHpStat(parent);
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
        },
        locations: (parent, args, { dataSources }) => {
            // return dataSources.pokemonAPI.getPokemonLocationIds(parent);
            // return {pokemonid: parent, locationNames: dataSources.pokemonAPI.getPokemonLocationNames(parent)}
            return dataSources.pokemonAPI.getPokemonLocationObjects(parent);
        },
        abilities: async (parent, args, { dataSources }) => {
            const abilityIds = await dataSources.pokemonAPI.getAbilitiesIds(
                parent
            );

            const pokemonAndAbilityIds = abilityIds.map(ability => {
                return {
                    pokemonId: parent,
                    abilityId: ability
                };
            });

            return pokemonAndAbilityIds;
        }
    },
    Location: {
        id: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonLocationId(parent);
        },
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonLocationName(parent);
        },
        games: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonLocationGames(parent);
        },
        pokemon: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getLocationPokemonEncounters(parent);
        }
    },
    Ability: {
        id: (parent, args, { dataSources }) => parent.abilityId,
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAbilityName(parent.abilityId);
        },
        is_hidden: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAbilityIsHidden(
                parent.pokemonId,
                parent.abilityId
            );
        },
        effects: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAbilityEffects(parent.abilityId);
        },
        pokemon: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonThatCanHaveAbility(
                parent.abilityId
            );
        }
    }
};

module.exports = { resolvers };
