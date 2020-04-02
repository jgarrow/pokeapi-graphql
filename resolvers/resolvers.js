const resolvers = {
    Query: {
        allPokemon: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAllPokemon(args.start, args.end);
        },
        allTypes: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAllTypes(args.start, args.end);
        },
        allMoves: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAllMoves(args.start, args.end);
        },
        allAbilities: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAllAbilities(args.start, args.end);
        },
        allEggGroups: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAllEggGroups(args.start, args.end);
        },
        allRegions: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAllRegions(args.start, args.end);
        },
        allGames: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getAllGames(args.start, args.end);
        },
        pokemon: (parent, args, { dataSources }) => {
            return args.number;
        },
        move: (parent, args, { dataSources }) => {
            return { moveId: args.id };
        },
        ability: (parent, args, { dataSources }) => {
            return { abilityId: args.id };
        },
        location: (parent, args, { dataSources }) => {
            return args.id;
        },
        type: (parent, args, { dataSources }) => {
            return args.id;
        },
        eggGroup: (parent, args, { dataSources }) => {
            return args.id;
        },
        region: (parent, args, { dataSources }) => {
            return args.id;
        },
        game: (parent, args, { dataSources }) => {
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
        locations: async (parent, args, { dataSources }) => {
            const locationAreaIds = await dataSources.pokemonAPI.getLocationAreaIdsFromPokemonEncounterObj(
                parent
            );

            const locationIds = locationAreaIds.map(async locAreaId => {
                return await dataSources.pokemonAPI.getLocationIdFromLocationAreaEndpoint(
                    locAreaId
                );
            });

            // gets rid of duplicates
            const locationIdsSet = new Set(locationIds);

            return [...locationIdsSet];
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
        },
        games: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonGames(parent);
        },
        generation: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getPokemonGeneration(parent);
        }
    },
    Location: {
        id: (parent, args, { dataSources }) => parent,
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getLocationName(parent);
        },
        region: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getLocationRegionId(parent);
        },
        games: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getLocationGames(parent);
        },
        pokemon: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getLocationPokemonFromLocationAreas(
                parent
            );
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
        id: (parent, args, { dataSources }) => parent.moveId,
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
    },
    Region: {
        id: (parent, args, { dataSources }) => parent,
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getRegionName(parent);
        },
        games: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getRegionGames(parent);
        },
        locations: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getRegionLocations(parent);
        }
    },
    Game: {
        id: (parent, args, { dataSources }) => parent,
        name: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getGameName(parent);
        },
        generation: async (parent, args, { dataSources }) => {
            const gameId = await dataSources.pokemonAPI.getGameVersionGroupId(
                parent
            );

            return dataSources.pokemonAPI.getGameGeneration(gameId);
        },
        regions: async (parent, args, { dataSources }) => {
            const gameId = await dataSources.pokemonAPI.getGameVersionGroupId(
                parent
            );

            return dataSources.pokemonAPI.getGameRegions(gameId);
        }
    }
};

module.exports = { resolvers };
