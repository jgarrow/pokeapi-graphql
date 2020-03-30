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
        },
        move: (parent, args, { dataSources }) => {
            return args.id;
        },
        ability: (parent, args, { dataSources }) => {
            return args.id;
        },
        location: (parent, args, { dataSources }) => {
            return args.id;
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
        base_stats: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonBaseStats(parent);
        },
        nat_dex_num: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getNationalPokedexNumber(parent);
        },
        pokedex_entries: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonPokedexEntries(parent);
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
        },
        types: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonTypeIds(parent);
        },
        egg_groups: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getEggGroupIds(parent);
        },
        moves: async (parent, args, { dataSources }) => {
            const moveIds = await dataSources.pokemonAPI.getMoveIds(parent);
            const pokemonAndMoveIds = moveIds.map(moveId => {
                return {
                    pokemonId: parent,
                    moveId: moveId
                };
            });

            return pokemonAndMoveIds;
        },
        sprites: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonSprites(parent);
        }
    },
    Location: {
        location_id: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonLocationId(parent);
        },
        location_area_id: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonLocationAreaId(parent);
        },
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonLocationName(parent);
        },
        region: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonLocationRegion(parent);
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
    },
    DexEntry: {
        description: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokedexEntryDescription(parent);
        },
        game: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokedexEntryVersion(parent);
        }
    },
    Type: {
        id: (parent, args, { dataSources }) => parent,
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonTypeName(parent);
        },
        pokemon: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonOfType(parent);
        },
        double_damage_from: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getTypeDoubleDamageFrom(parent);
        },
        double_damage_to: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getTypeDoubleDamageTo(parent);
        },
        half_damage_from: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getTypeHalfDamageFrom(parent);
        },
        half_damage_to: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getTypeHalfDamageTo(parent);
        },
        no_damage_from: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getTypeNoDamageFrom(parent);
        },
        no_damage_to: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getTypeNoDamageTo(parent);
        }
    },
    EggGroup: {
        id: (parent, args, { dataSources }) => parent,
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getEggGroupName(parent);
        },
        pokemon: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getEggGroupPokemonIds(parent);
        }
    },
    Move: {
        id: (parent, args, { dataSources }) => parent,
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getMoveName(parent.moveId);
        },
        type: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getMoveTypeId(parent.moveId);
        },
        damage_class: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getMoveDamageClass(parent.moveId);
        },
        power: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getMovePower(parent.moveId);
        },
        pp: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getMovePp(parent.moveId);
        },
        accuracy: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getMoveAccuracy(parent.moveId);
        },
        effects: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getMoveEffects(parent.moveId);
        },
        learn_methods: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getMoveLearnMethods(
                parent.pokemonId,
                parent.moveId
            );
        }
    }
};

module.exports = { resolvers };
