const { RESTDataSource } = require("apollo-datasource-rest");
const { parseUrl } = require("../utils/parseUrl");

class PokemonAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://pokeapi.co/api/v2";
    }

    async getAllPokemon(start = 0, end = 964) {
        const response = await this.get(`pokemon?offset=${start}&limit=${end}`);

        const pokemonIds = response.results.map(pokemon =>
            parseUrl(pokemon.url)
        );

        return pokemonIds;
    }

    async getAllTypes(start = 0, end = 20) {
        const response = await this.get(`type?offset=${start}&limit=${end}`);

        const typeIds = response.results.map(type => parseUrl(type.url));

        return typeIds;
    }

    async getAllMoves(start = 0, end = 746) {
        const response = await this.get(`move?offset=${start}&limit=${end}`);

        const moveIds = response.results.map(move => {
            return {
                moveId: parseUrl(move.url)
            };
        });

        console.log(moveIds);
        return moveIds;
    }

    async getAllAbilities(start = 0, end = 293) {
        const response = await this.get(`ability?offset=${start}&limit=${end}`);

        const abilityIds = response.results.map(ability => {
            return { abilityId: parseUrl(ability.url) };
        });

        return abilityIds;
    }

    async getAllEggGroups(start = 0, end = 15) {
        const response = await this.get(
            `egg-group?offset=${start}&limit=${end}`
        );

        const eggGroupdIds = response.results.map(eggGroup =>
            parseUrl(eggGroup.url)
        );

        return eggGroupdIds;
    }

    async getAllRegions(start = 0, end = 7) {
        const response = await this.get(`region?offset=${start}&limit=${end}`);

        const regionIds = response.results.map(region => parseUrl(region.url));

        return regionIds;
    }

    async getAllGames(start = 0, end = 30) {
        const response = await this.get(`/version?offset=${start}&end=${end}`);

        const gameIds = response.results.map(game => parseUrl(game.url));

        return gameIds;
    }

    // evolutionChainObj is the data object response from the evolution-chain endpoint
    async getEvolvesToPokemonId(currentPokemonName, evolutionChainObj) {
        // don't need evolution tier III because the third tier can't evolve into anything else
        const tierIName = evolutionChainObj.chain.species.name;

        // tier II is an array because tier I can evolve into multiple things (i.e. Eevee)
        const tierIINamesArray = evolutionChainObj.chain.evolves_to.map(
            pokemon => pokemon.species.name
        );

        let pokemonIdsArray = [];

        // if the currentPokemonName is a tier I evolution
        if (currentPokemonName === tierIName) {
            pokemonIdsArray = evolutionChainObj.chain.evolves_to.map(
                pokemon => {
                    // const urlSplit = pokemon.species.url.split("/");
                    // const pokemonId = urlSplit[urlSplit.length - 2];
                    const pokemonId = parseUrl(pokemon.species.url);

                    return pokemonId;
                }
            );
            // if the currentPokemonName is a tier II evolution
        } else if (tierIINamesArray.includes(currentPokemonName)) {
            pokemonIdsArray = evolutionChainObj.chain.evolves_to
                .map(evolutionTierIIObj => {
                    return evolutionTierIIObj.evolves_to
                        .map(evolutionTierIIIObj => {
                            // const urlSplit = evolutionTierIIIObj.species.url.split(
                            //     "/"
                            // );
                            // const pokemonId = urlSplit[urlSplit.length - 2];

                            const pokemonId = parseUrl(
                                evolutionTierIIIObj.species.url
                            );

                            return pokemonId;
                        })
                        .flat();
                })
                .flat();
        }

        return pokemonIdsArray;
    }

    async getEvolvesFromPokemonId(currentPokemonName, evolutionChainObj) {
        let pokemonId = null;

        // don't need tier I pokemon because they can't evolve from something
        const tierIINamesArray = evolutionChainObj.chain.evolves_to.map(
            pokemon => pokemon.species.name
        );

        let tierII = null;

        evolutionChainObj.chain.evolves_to.forEach(tierIIPokemon => {
            const tierIIIPokemons = tierIIPokemon.evolves_to.map(
                tierIIIPokemon => tierIIIPokemon.species.name
            );

            if (tierIIIPokemons.includes(currentPokemonName)) {
                tierII = tierIIPokemon;
            }
        });

        // if the current pokemon is a tier II evolution
        if (tierIINamesArray.includes(currentPokemonName)) {
            // get the id for the tier I evolution
            pokemonId = parseUrl(evolutionChainObj.chain.species.url);
        } else if (tierII) {
            // get the id for the tier II evolution
            pokemonId = parseUrl(tierII.species.url);
        }

        return pokemonId;
    }

    async getPokemonId(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        return basicResponse.id;
    }

    async getPokemonName(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        return basicResponse.name;
    }

    async getPokemonHeight(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        return basicResponse.height;
    }

    async getPokemonWeight(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        return basicResponse.weight;
    }

    async getAttackStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const attack = stats.find(stat => stat.stat.name === "attack");

        return attack.base_stat;
    }

    async getDefenseStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const defense = stats.find(stat => stat.stat.name === "defense");

        return defense.base_stat;
    }

    async getSpeedStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const speed = stats.find(stat => stat.stat.name === "speed");

        return speed.base_stat;
    }

    async getSpecialAttackStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const specialAttack = stats.find(
            stat => stat.stat.name === "special-attack"
        );

        return specialAttack.base_stat;
    }

    async getSpecialDefenseStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const specialDefense = stats.find(
            stat => stat.stat.name === "special-defense"
        );

        return specialDefense.base_stat;
    }

    async getHpStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const hp = stats.find(stat => stat.stat.name === "hp");

        return hp.base_stat;
    }

    async getPokemonBaseStats(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const attack = await this.getAttackStat(id);
        const defense = await this.getDefenseStat(id);
        const specialAttack = await this.getSpecialAttackStat(id);
        const specialDefense = await this.getSpecialDefenseStat(id);
        const speed = await this.getSpeedStat(id);
        const hp = await this.getHpStat(id);

        return {
            attack: parseInt(attack),
            defense: parseInt(defense),
            speed: parseInt(speed),
            special_attack: parseInt(specialAttack),
            special_defense: parseInt(specialDefense),
            hp: parseInt(hp)
        };
    }

    async getWhoPokemonEvolvesTo(id) {
        // need to get name for getEvolvesToPokemonId method
        const basicResponse = await this.get(`/pokemon/${id}`);

        const speciesResponse = await this.get(`/pokemon-species/${id}`);

        const evolutionChainResponse = await this.get(
            speciesResponse.evolution_chain.url
        );

        // an array because a pokemon has potential to evolve to multiple other pokemon (i.e. eevee, kirlia, snorunt)
        const evolvesToIdArray = await this.getEvolvesToPokemonId(
            basicResponse.name,
            evolutionChainResponse
        );

        return evolvesToIdArray.length ? evolvesToIdArray : null;
    }

    // evolution details for how the Pokemon evolved from their previous evolution tier (i.e. current pokemon is charmeleon, get details for how charmander evolved into charmeleon)
    async getEvolvedAtDetails(id) {
        // only get if current pokemon is tier 2 or 3

        let evolved_at_criteria = null;

        // need to get name for getEvolvesToPokemonId method
        const basicResponse = await this.get(`/pokemon/${id}`);

        const speciesResponse = await this.get(`/pokemon-species/${id}`);

        const evolutionChainResponse = await this.get(
            speciesResponse.evolution_chain.url
        );

        let currentPokemon = null;

        evolutionChainResponse.chain.evolves_to.forEach(tierIIPokemon => {
            tierIIPokemon.evolves_to.forEach(tierIIIPokemon => {
                if (tierIIIPokemon.species.name === basicResponse.name) {
                    currentPokemon = tierIIIPokemon;
                }
            });

            if (tierIIPokemon.species.name === basicResponse.name) {
                currentPokemon = tierIIPokemon;
            }
        });

        if (currentPokemon) {
            evolved_at_criteria = currentPokemon.evolution_details
                .map(evoDetailsObj => {
                    const criteriaKeys = Object.keys(evoDetailsObj).filter(
                        key =>
                            evoDetailsObj[key] &&
                            evoDetailsObj[key] !== "" &&
                            key !== "trigger"
                    );
                    return criteriaKeys
                        .map(key => {
                            return {
                                name: key,
                                value:
                                    typeof evoDetailsObj[key] === "object"
                                        ? evoDetailsObj[key].name
                                        : evoDetailsObj[key].toString()
                            };
                        })
                        .flat();
                })
                .flat();
        }

        return evolved_at_criteria;
    }

    async getEvolutionTrigger(id) {
        // need to get name for getEvolvesToPokemonId method
        const basicResponse = await this.get(`/pokemon/${id}`);

        const speciesResponse = await this.get(`/pokemon-species/${id}`);

        const evolutionChainResponse = await this.get(
            speciesResponse.evolution_chain.url
        );

        let currentPokemon = null;

        evolutionChainResponse.chain.evolves_to.forEach(tierIIPokemon => {
            tierIIPokemon.evolves_to.forEach(tierIIIPokemon => {
                if (tierIIIPokemon.species.name === basicResponse.name) {
                    currentPokemon = tierIIIPokemon;
                }
            });

            if (tierIIPokemon.species.name === basicResponse.name) {
                currentPokemon = tierIIPokemon;
            }
        });

        // trigger is the same regardless of if there is more than one object in 'evolution_details'
        if (currentPokemon) {
            return currentPokemon.evolution_details[0].trigger.name;
        } else {
            return null;
        }
    }

    async getWhoPokemonEvolvesFrom(id) {
        // need to get name for getEvolvesToPokemonId method
        const basicResponse = await this.get(`/pokemon/${id}`);

        const speciesResponse = await this.get(`/pokemon-species/${id}`);

        const evolutionChainResponse = await this.get(
            speciesResponse.evolution_chain.url
        );

        // not an array because a pokemon can only evolve from 1 pokemon
        const evolvesFromId = await this.getEvolvesFromPokemonId(
            basicResponse.name,
            evolutionChainResponse
        );

        return evolvesFromId ? evolvesFromId : null;
    }

    async getNationalPokedexNumber(id) {
        const speciesResponse = await this.get(`/pokemon-species/${id}`);

        const dexNumbers = speciesResponse.pokedex_numbers;

        const nationalDexObj = dexNumbers.find(
            pokedex => pokedex.pokedex.name === "national"
        );

        return parseInt(nationalDexObj.entry_number);
    }

    async getPokemonEncounterLocationObj(pokemonId) {
        return await this.get(`/pokemon/${pokemonId}/encounters`);
    }

    async getLocationAreaIdsFromPokemonEncounterObj(pokemonId) {
        const pokemonEncounterResponse = await this.get(
            `/pokemon/${pokemonId}/encounters`
        );

        const locationAreaIds = pokemonEncounterResponse.map(locationArea =>
            parseUrl(locationArea.location_area.url)
        );

        return locationAreaIds;
    }

    async getLocationAreaIdsFromLocationEndpoint(locationId) {
        const locationResponse = await this.get(`/location/${locationId}`);

        const locationAreaIds = locationResponse.areas.map(area =>
            parseUrl(area.url)
        );

        return locationAreaIds;
    }

    async getLocationIdFromLocationAreaEndpoint(locationAreaId) {
        const locationAreaResponse = await this.get(
            `/location-area/${locationAreaId}`
        );

        const locationId = parseUrl(locationAreaResponse.location.url);

        return locationId;
    }

    async getLocationName(locationId) {
        const locationResponse = await this.get(`/location/${locationId}`);

        return locationResponse.name;
    }

    async getLocationRegionId(locationId) {
        const locationResponse = await this.get(`/location/${locationId}`);

        const regionId = parseUrl(locationResponse.region.url);

        return regionId;
    }

    async getLocationAreaPokemon(locationAreaId) {
        const locationAreaResponse = await this.get(
            `/location-area/${locationAreaId}`
        );

        const pokemonIds = locationAreaResponse.pokemon_encounters.map(
            pokemon => parseUrl(pokemon.pokemon.url)
        );

        return pokemonIds;
    }

    async getLocationPokemonFromLocationAreas(locationId) {
        const locationAreaIds = await this.getLocationAreaIdsFromLocationEndpoint(
            locationId
        );

        // for each location area for this location, get all of the ids for all of the pokemon at each location area
        const pokemonIdsPromise = await locationAreaIds.map(async id => {
            const monIds = await this.getLocationAreaPokemon(id);
            return monIds;
        });
        const pokemonIdsArrays = await Promise.all(pokemonIdsPromise);
        const pokemonIds = pokemonIdsArrays.flat();

        // gets rid of duplicates
        const pokemonIdsSet = new Set(pokemonIds);

        const deduplicatedIds = [...pokemonIdsSet];
        return deduplicatedIds;
    }

    async getLocationGames(locationId) {
        const locationAreaIds = await this.getLocationAreaIdsFromLocationEndpoint(
            locationId
        );

        const gameIdsPromise = await locationAreaIds.map(async id => {
            const locationAreaResp = await this.get(`/location-area/${id}`);

            const gameIdsArray = locationAreaResp.encounter_method_rates.map(
                version => {
                    return version.version_details.map(game => {
                        return parseUrl(game.version.url);
                    });
                }
            );
            return gameIdsArray.flat();
        });

        const gameIds = await Promise.all(gameIdsPromise);
        const gameIdsFlattened = gameIds.flat();

        // get rid of duplicates
        const gameIdsSet = new Set(gameIdsFlattened);
        return [...gameIdsSet];
    }

    // async getPokemonLocationObjects(pokemonId) {
    //     return await this.get(`/pokemon/${pokemonId}/encounters`);
    // }

    // can use location id to hit `/location-area/${id}` for Location type
    // async getPokemonLocationAreaId(locationObj) {
    //     return parseUrl(locationObj.location_area.url);
    // }

    // async getPokemonLocationId(locationObj) {
    //     const locationAreaId = await this.getPokemonLocationAreaId(locationObj);

    //     const locationAreaResponse = await this.get(
    //         `/location-area/${locationAreaId}`
    //     );

    //     const locationId = parseUrl(locationAreaResponse.location.url);

    //     return locationId;
    // }

    // async getPokemonLocationName(locationObj) {
    //     const locationId = await this.getPokemonLocationId(locationObj);
    //     const locationResponse = await this.get(`/location/${locationId}`);

    //     const allNames = locationResponse.names;
    //     const englishName = allNames.find(name => name.language.name === "en")
    //         .name;

    //     return englishName;
    // }

    // async getPokemonLocationRegion(locationObj) {
    //     const locationId = await this.getPokemonLocationId(locationObj);
    //     const locationResponse = await this.get(`/location/${locationId}`);
    //     const region = locationResponse.region.name;

    //     return region;
    // }

    // async getPokemonLocationGames(locationObj) {
    //     const games = locationObj.version_details.map(
    //         game => game.version.name
    //     );

    //     return games;
    // }

    // async getLocationPokemonEncounters(locationObj) {
    //     let pokemonEncounters = [];

    //     const locationAreaResponse = await this.get(
    //         locationObj.location_area.url
    //     );

    //     const findablePokemon = locationAreaResponse.pokemon_encounters;

    //     if (findablePokemon.length) {
    //         pokemonEncounters = findablePokemon.map(pokemon =>
    //             parseUrl(pokemon.pokemon.url)
    //         );
    //     }

    //     return pokemonEncounters;
    // }

    async getAbilitiesIds(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const abilities = basicResponse.abilities;
        const abilityIds = abilities.map(ability =>
            parseUrl(ability.ability.url)
        );

        return abilityIds;
    }

    async getAbilityName(abilityId) {
        const abilityResponse = await this.get(`/ability/${abilityId}`);

        const name = abilityResponse.name;

        return name;
    }

    async getAbilityEffects(abilityId) {
        const abilityResponse = await this.get(`/ability/${abilityId}`);

        const effects = abilityResponse.effect_entries.map(
            effect => effect.effect
        );

        return effects;
    }

    async getAbilityIsHidden(pokemonId, abilityId) {
        const pokemonResponse = await this.get(`/pokemon/${pokemonId}`);

        const abilityObj = pokemonResponse.abilities.find(
            ability => parseUrl(ability.ability.url) === abilityId
        );

        return abilityObj.is_hidden;
    }

    async getPokemonThatCanHaveAbility(abilityId) {
        const abilityResponse = await this.get(`/ability/${abilityId}`);

        const pokemonList = abilityResponse.pokemon.map(pokemon =>
            parseUrl(pokemon.pokemon.url)
        );

        return pokemonList;
    }

    async getPokemonPokedexEntries(pokemonId) {
        const speciesResponse = await this.get(`/pokemon-species/${pokemonId}`);

        // just get the english entries
        let pokedexEntries = speciesResponse.flavor_text_entries.filter(
            entry => entry.language.name === "en"
        );

        // make all whitespace consistent
        pokedexEntries.forEach(entry => {
            entry.flavor_text = entry.flavor_text.replace(/\s/gm, " ");
        });

        return pokedexEntries;
    }

    async getPokedexEntryDescription(entryObj) {
        return entryObj.flavor_text;
    }

    async getPokedexEntryVersion(entryObj) {
        return entryObj.version.name;
    }

    async getPokemonTypeIds(pokemonId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);
        const types = basicResponse.types;
        const typeIds = types.map(type => parseUrl(type.type.url));
        return typeIds;
    }

    async getPokemonTypeName(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        return typeResponse.name;
    }

    async getTypeDoubleDamageFrom(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.double_damage_from;
        const typeIds = types.map(type => parseUrl(type.url));

        return typeIds;
    }

    async getTypeDoubleDamageTo(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.double_damage_to;
        const typeIds = types.map(type => parseUrl(type.url));

        return typeIds;
    }

    async getTypeHalfDamageFrom(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.half_damage_from;
        const typeIds = types.map(type => parseUrl(type.url));

        return typeIds;
    }

    async getTypeHalfDamageTo(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.half_damage_to;
        const typeIds = types.map(type => parseUrl(type.url));

        return typeIds;
    }

    async getTypeNoDamageFrom(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.no_damage_from;
        const typeIds = types.map(type => parseUrl(type.url));

        return typeIds.length ? typeIds : null;
    }

    async getTypeNoDamageTo(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.no_damage_to;
        const typeIds = types.map(type => parseUrl(type.url));

        return typeIds.length ? typeIds : null;
    }

    async getPokemonOfType(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const pokemon = typeResponse.pokemon;
        const pokemonIds = pokemon.map(pokemon =>
            parseUrl(pokemon.pokemon.url)
        );

        return pokemonIds;
    }

    async getEggGroupIds(pokemonId) {
        const speciesResponse = await this.get(`/pokemon-species/${pokemonId}`);
        const eggGroups = speciesResponse.egg_groups;
        const eggGroupIds = eggGroups.map(eggGroup => parseUrl(eggGroup.url));

        return eggGroupIds;
    }

    async getEggGroupName(eggGroupId) {
        const eggGroupResponse = await this.get(`/egg-group/${eggGroupId}`);

        return eggGroupResponse.name;
    }

    async getEggGroupPokemonIds(eggGroupId) {
        const eggGroupResponse = await this.get(`/egg-group/${eggGroupId}`);

        const pokemon = eggGroupResponse.pokemon_species;
        const pokemonIds = pokemon.map(pokemon => parseUrl(pokemon.url));

        return pokemonIds;
    }

    async getMoveIds(pokemonId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);

        const moves = basicResponse.moves;
        const moveIds = moves.map(move => parseUrl(move.move.url));

        return moveIds;
    }

    async getMoveName(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);

        return moveResponse.name;
    }

    async getMoveTypeId(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);

        const moveTypeId = parseUrl(moveResponse.type.url);
        return moveTypeId;
    }

    // special or physical
    async getMoveDamageClass(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        const damageClass = moveResponse.damage_class.name;
        return damageClass;
    }

    async getMovePower(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        return moveResponse.power;
    }

    async getMovePp(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        return moveResponse.pp;
    }

    async getMoveAccuracy(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        return moveResponse.accuracy;
    }

    async getMoveEffectChance(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        return moveResponse.effect_chance;
    }

    async getMoveEffects(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        const moveEffects = moveResponse.effect_entries.map(async effect => {
            const moveEffectChance = await this.getMoveEffectChance(moveId);

            return effect.effect.replace("$effect_chance", moveEffectChance);
        });

        return moveEffects;
    }
    l;
    async getMoveLearnMethods(pokemonId, moveId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);
        const moves = basicResponse.moves;

        const desiredMove = moves.find(
            move => parseUrl(move.move.url) === moveId
        );

        const learnMethods = desiredMove.version_group_details.map(game => {
            return {
                method: game.move_learn_method.name,
                level_learned_at:
                    game.level_learned_at > 0 ? game.level_learned_at : null,
                game: game.version_group.name
            };
        });

        return learnMethods;
    }

    async getPokemonSprites(pokemonId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);

        return basicResponse.sprites;
    }

    async getRegionName(regionId) {
        const regionResponse = await this.get(`/region/${regionId}`);

        return regionResponse.name;
    }

    async getRegionLocations(regionId) {
        const regionResponse = await this.get(`/region/${regionId}`);

        const locationIds = regionResponse.locations.map(location =>
            parseUrl(location.url)
        );

        return locationIds;
    }

    async getRegionGames(regionId) {
        const regionResponse = await this.get(`/region/${regionId}`);

        const gameIds = regionResponse.version_groups.map(game =>
            parseUrl(game.url)
        );

        return gameIds;
    }

    async getGameName(gameId) {
        const gameResponse = await this.get(`/version/${gameId}`);

        return gameResponse.name;
    }

    async getGameVersionGroupId(gameId) {
        const gameResponse = await this.get(`/version/${gameId}`);

        const versionGroupId = parseUrl(gameResponse.version_group.url);

        return versionGroupId;
    }

    async getGameGeneration(gameId) {
        const gameResponse = await this.get(`/version-group/${gameId}`);

        return gameResponse.generation.name;
    }

    async getGameRegions(gameId) {
        const gameResponse = await this.get(`/version-group/${gameId}`);

        const regionIds = gameResponse.regions.map(region =>
            parseUrl(region.url)
        );

        return regionIds;
    }
}

module.exports = { PokemonAPI };
