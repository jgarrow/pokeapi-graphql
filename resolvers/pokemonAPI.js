const { RESTDataSource } = require("apollo-datasource-rest");
const { parseUrl } = require("../utils/parseUrl");

class PokemonAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://pokeapi.co/api/v2";
    }

    async getallPokemonNamesAndIds(start = 0, end = 964) {
        const response = await this.get(`pokemon?offset=${start}&limit=${end}`);

        const namesAndIds = response.results.map((pokemon) => {
            const id = parseUrl(pokemon.url);
            const name = pokemon.name;
            return {
                id,
                name,
            };
        });

        return namesAndIds;
    }

    async getAllPokemonIds(start = 0, end = 964) {
        console.log(`pokemon?offset=${start}&limit=${end}`);
        const response = await this.get(`pokemon?offset=${start}&limit=${end}`);

        const pokemonIds = response.results.map((pokemon) =>
            parseUrl(pokemon.url)
        );

        return pokemonIds;
    }

    async getAllTypes(start = 0, end = 20) {
        const response = await this.get(`type?offset=${start}&limit=${end}`);

        const typeIds = response.results.map((type) => parseUrl(type.url));

        return typeIds;
    }

    async getAllMoves(start = 0, end = 746) {
        const response = await this.get(`move?offset=${start}&limit=${end}`);

        const moveIds = response.results.map((move) => {
            return {
                moveId: parseUrl(move.url),
            };
        });

        return moveIds;
    }

    async getAllAbilities(start = 0, end = 293) {
        const response = await this.get(`ability?offset=${start}&limit=${end}`);

        const abilityIds = response.results.map((ability) => {
            return { abilityId: parseUrl(ability.url) };
        });

        return abilityIds;
    }

    async getAllEggGroups(start = 0, end = 15) {
        const response = await this.get(
            `egg-group?offset=${start}&limit=${end}`
        );

        const eggGroupdIds = response.results.map((eggGroup) =>
            parseUrl(eggGroup.url)
        );

        return eggGroupdIds;
    }

    async getAllRegions(start = 0, end = 7) {
        const response = await this.get(`region?offset=${start}&limit=${end}`);

        const regionIds = response.results.map((region) =>
            parseUrl(region.url)
        );

        return regionIds;
    }

    async getAllGames(start = 0, end = 30) {
        const response = await this.get(`/version?offset=${start}&end=${end}`);

        const gameIds = response.results.map((game) => parseUrl(game.url));

        return gameIds;
    }

    // evolutionChainObj is the data object response from the evolution-chain endpoint
    async getEvolvesToPokemonId(currentPokemonName, evolutionChainObj) {
        // don't need evolution tier III because the third tier can't evolve into anything else
        const tierIName = evolutionChainObj.chain.species.name;

        // tier II is an array because tier I can evolve into multiple things (i.e. Eevee)
        const tierIINamesArray = evolutionChainObj.chain.evolves_to.map(
            (pokemon) => pokemon.species.name
        );

        let pokemonIdsArray = [];

        // if the currentPokemonName is a tier I evolution
        if (currentPokemonName === tierIName) {
            pokemonIdsArray = evolutionChainObj.chain.evolves_to.map(
                (pokemon) => {
                    const pokemonId = parseUrl(pokemon.species.url);

                    return pokemonId;
                }
            );
            // if the currentPokemonName is a tier II evolution
        } else if (tierIINamesArray.includes(currentPokemonName)) {
            pokemonIdsArray = evolutionChainObj.chain.evolves_to
                .map((evolutionTierIIObj) => {
                    return evolutionTierIIObj.evolves_to
                        .map((evolutionTierIIIObj) => {
                            const pokemonId = parseUrl(
                                evolutionTierIIIObj.species.url
                            );

                            return pokemonId;
                        })
                        .flat();
                })
                .flat();
        }

        return pokemonIdsArray ? pokemonIdsArray : null;
    }

    async getEvolvesFromPokemonId(currentPokemonName, evolutionChainObj) {
        let pokemonId = null;

        // don't need tier I pokemon because they can't evolve from something
        const tierIINamesArray = evolutionChainObj.chain.evolves_to.map(
            (pokemon) => pokemon.species.name
        );

        let tierII = null;

        evolutionChainObj.chain.evolves_to.forEach((tierIIPokemon) => {
            const tierIIIPokemons = tierIIPokemon.evolves_to.map(
                (tierIIIPokemon) => tierIIIPokemon.species.name
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

        return pokemonId ? pokemonId : null;
    }

    async getPokemonId(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        return basicResponse.id;
    }

    async getPokemonSpeciesId(pokemonId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);
        const speciesId = parseUrl(basicResponse.species.url);

        return speciesId;
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
        const attack = stats.find((stat) => stat.stat.name === "attack");

        return attack.base_stat ? attack.base_stat : null;
    }

    async getDefenseStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const defense = stats.find((stat) => stat.stat.name === "defense");

        return defense.base_stat ? defense.base_stat : null;
    }

    async getSpeedStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const speed = stats.find((stat) => stat.stat.name === "speed");

        return speed.base_stat ? speed.base_stat : null;
    }

    async getSpecialAttackStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const specialAttack = stats.find(
            (stat) => stat.stat.name === "special-attack"
        );

        return specialAttack.base_stat ? specialAttack.base_stat : null;
    }

    async getSpecialDefenseStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const specialDefense = stats.find(
            (stat) => stat.stat.name === "special-defense"
        );

        return specialDefense.base_stat ? specialDefense.base_stat : null;
    }

    async getHpStat(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const stats = basicResponse.stats;
        const hp = stats.find((stat) => stat.stat.name === "hp");

        return hp.base_stat ? hp.base_stat : null;
    }

    async getPokemonBaseStats(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
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
            hp: parseInt(hp),
        };
    }

    async getPokemonGeneration(pokemonId) {
        const speciesId = await this.getPokemonSpeciesId(pokemonId);

        const speciesResponse = await this.get(`/pokemon-species/${speciesId}`);

        return speciesResponse.generation.name
            ? speciesResponse.generation.name
            : null;
    }

    async getWhoPokemonEvolvesTo(id) {
        // need this to get the name for getEvolvesToPokemonId method
        const basicResponse = await this.get(`/pokemon/${id}`);

        const speciesId = await this.getPokemonSpeciesId(id);

        const speciesResponse = await this.get(`/pokemon-species/${speciesId}`);

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

        // need this to get the name for getEvolvesToPokemonId method
        const basicResponse = await this.get(`/pokemon/${id}`);

        const speciesId = await this.getPokemonSpeciesId(id);

        const speciesResponse = await this.get(`/pokemon-species/${speciesId}`);

        const evolutionChainResponse = await this.get(
            speciesResponse.evolution_chain.url
        );

        let currentPokemon = null;

        evolutionChainResponse.chain.evolves_to.forEach((tierIIPokemon) => {
            tierIIPokemon.evolves_to.forEach((tierIIIPokemon) => {
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
                .map((evoDetailsObj) => {
                    const criteriaKeys = Object.keys(evoDetailsObj).filter(
                        (key) =>
                            evoDetailsObj[key] &&
                            evoDetailsObj[key] !== "" &&
                            key !== "trigger"
                    );
                    return criteriaKeys
                        .map((key) => {
                            return {
                                name: key,
                                value:
                                    typeof evoDetailsObj[key] === "object"
                                        ? evoDetailsObj[key].name
                                        : evoDetailsObj[key].toString(),
                            };
                        })
                        .flat();
                })
                .flat();
        }

        return evolved_at_criteria ? evolved_at_criteria : null;
    }

    async getEvolutionTrigger(id) {
        // need this to get the name for getEvolvesToPokemonId method
        const basicResponse = await this.get(`/pokemon/${id}`);

        const speciesId = await this.getPokemonSpeciesId(id);

        const speciesResponse = await this.get(`/pokemon-species/${speciesId}`);

        const evolutionChainResponse = await this.get(
            speciesResponse.evolution_chain.url
        );

        let currentPokemon = null;

        evolutionChainResponse.chain.evolves_to.forEach((tierIIPokemon) => {
            tierIIPokemon.evolves_to.forEach((tierIIIPokemon) => {
                if (tierIIIPokemon.species.name === basicResponse.name) {
                    currentPokemon = tierIIIPokemon;
                }
            });

            if (tierIIPokemon.species.name === basicResponse.name) {
                currentPokemon = tierIIPokemon;
            }
        });

        // trigger is the same regardless of if there is more than one object in 'evolution_details'
        return currentPokemon
            ? currentPokemon.evolution_details[0].trigger.name
            : null;
        // if (currentPokemon) {
        //     return currentPokemon.evolution_details[0].trigger.name;
        // } else {
        //     return null;
        // }
    }

    async getWhoPokemonEvolvesFrom(id) {
        // need this to get the name for getEvolvesToPokemonId method
        const basicResponse = await this.get(`/pokemon/${id}`);

        const speciesId = await this.getPokemonSpeciesId(id);

        const speciesResponse = await this.get(`/pokemon-species/${speciesId}`);

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
        const speciesId = await this.getPokemonSpeciesId(id);
        const speciesResponse = await this.get(`/pokemon-species/${speciesId}`);

        const dexNumbers = speciesResponse.pokedex_numbers;

        const nationalDexObj = dexNumbers.find(
            (pokedex) => pokedex.pokedex.name === "national"
        );

        return nationalDexObj ? parseInt(nationalDexObj.entry_number) : null;
    }

    async getPokemonGames(pokemonId) {
        const pokemonResponse = await this.get(`/pokemon/${pokemonId}`);

        const gameIds = pokemonResponse.game_indices.map((game) =>
            parseUrl(game.version.url)
        );

        return gameIds ? gameIds : null;
    }

    async getPokemonEncounterLocationObj(pokemonId) {
        return await this.get(`/pokemon/${pokemonId}/encounters`);
    }

    async getLocationAreaIdsFromPokemonEncounterObj(pokemonId) {
        const pokemonEncounterResponse = await this.get(
            `/pokemon/${pokemonId}/encounters`
        );

        const locationAreaIds = pokemonEncounterResponse.map((locationArea) =>
            parseUrl(locationArea.location_area.url)
        );

        return locationAreaIds ? locationAreaIds : null;
    }

    async getLocationAreaIdsFromLocationEndpoint(locationId) {
        const locationResponse = await this.get(`/location/${locationId}`);

        const locationAreaIds = locationResponse.areas.map((area) =>
            parseUrl(area.url)
        );

        return locationAreaIds ? locationAreaIds : null;
    }

    async getLocationIdFromLocationAreaEndpoint(locationAreaId) {
        const locationAreaResponse = await this.get(
            `/location-area/${locationAreaId}`
        );

        const locationId = parseUrl(locationAreaResponse.location.url);

        return locationId ? locationId : null;
    }

    async getLocationName(locationId) {
        const locationResponse = await this.get(`/location/${locationId}`);

        return locationResponse.name ? locationResponse.name : null;
    }

    async getLocationRegionId(locationId) {
        const locationResponse = await this.get(`/location/${locationId}`);

        const regionId = parseUrl(locationResponse.region.url);

        return regionId ? regionId : null;
    }

    async getLocationAreaPokemon(locationAreaId) {
        const locationAreaResponse = await this.get(
            `/location-area/${locationAreaId}`
        );

        const pokemonIds = locationAreaResponse.pokemon_encounters.map(
            (pokemon) => parseUrl(pokemon.pokemon.url)
        );

        return pokemonIds ? pokemonIds : null;
    }

    async getLocationPokemonFromLocationAreas(locationId) {
        const locationAreaIds = await this.getLocationAreaIdsFromLocationEndpoint(
            locationId
        );

        // for each location area for this location, get all of the ids for all of the pokemon at each location area
        const pokemonIdsPromise = await locationAreaIds.map(async (id) => {
            const monIds = await this.getLocationAreaPokemon(id);
            return monIds;
        });
        const pokemonIdsArrays = await Promise.all(pokemonIdsPromise);
        const pokemonIds = pokemonIdsArrays.flat();

        // gets rid of duplicates
        const pokemonIdsSet = new Set(pokemonIds);

        const deduplicatedIds = [...pokemonIdsSet];
        return deduplicatedIds ? deduplicatedIds : null;
    }

    async getLocationGames(locationId) {
        const locationAreaIds = await this.getLocationAreaIdsFromLocationEndpoint(
            locationId
        );

        const gameIdsPromise = await locationAreaIds.map(async (id) => {
            const locationAreaResp = await this.get(`/location-area/${id}`);

            const gameIdsArray = locationAreaResp.encounter_method_rates.map(
                (version) => {
                    return version.version_details.map((game) => {
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
        return [...gameIdsSet] ? [...gameIdsSet] : null;
    }

    async getAbilitiesIds(id) {
        const basicResponse = await this.get(`/pokemon/${id}`);
        const abilities = basicResponse.abilities;
        const abilityIds = abilities.map((ability) =>
            parseUrl(ability.ability.url)
        );

        return abilityIds ? abilityIds : null;
    }

    async getAbilityName(abilityId) {
        const abilityResponse = await this.get(`/ability/${abilityId}`);

        const name = abilityResponse.name;

        return name ? name : null;
    }

    async getAbilityEffects(abilityId) {
        const abilityResponse = await this.get(`/ability/${abilityId}`);

        const effects = abilityResponse.effect_entries.map(
            (effect) => effect.effect
        );

        return effects ? effects : null;
    }

    async getAbilityIsHidden(pokemonId, abilityId) {
        const pokemonResponse = await this.get(`/pokemon/${pokemonId}`);

        const abilityObj = pokemonResponse.abilities.find(
            (ability) => parseUrl(ability.ability.url) === abilityId
        );

        return abilityObj.is_hidden ? abilityObj.is_hidden : null;
    }

    async getPokemonThatCanHaveAbility(abilityId) {
        const abilityResponse = await this.get(`/ability/${abilityId}`);

        const pokemonList = abilityResponse.pokemon.map((pokemon) =>
            parseUrl(pokemon.pokemon.url)
        );

        return pokemonList ? pokemonList : null;
    }

    async getPokemonPokedexEntries(pokemonId) {
        const speciesId = await this.getPokemonSpeciesId(pokemonId);
        const speciesResponse = await this.get(`/pokemon-species/${speciesId}`);

        // just get the english entries
        let pokedexEntries = speciesResponse.flavor_text_entries.filter(
            (entry) => entry.language.name === "en"
        );

        // make all whitespace consistent
        pokedexEntries.forEach((entry) => {
            entry.flavor_text = entry.flavor_text.replace(/\s/gm, " ");
        });

        return pokedexEntries ? pokedexEntries : null;
    }

    async getPokedexEntryDescription(entryObj) {
        return entryObj.flavor_text ? entryObj.flavor_text : null;
    }

    async getPokedexEntryVersion(entryObj) {
        return entryObj.version.name ? entryObj.version.name : null;
    }

    async getPokemonTypeIds(pokemonId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);
        const types = basicResponse.types;
        const typeIds = types.map((type) => parseUrl(type.type.url));
        return typeIds ? typeIds : null;
    }

    async getPokemonTypeName(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        return typeResponse.name ? typeResponse.name : null;
    }

    async getTypeDoubleDamageFrom(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.double_damage_from;
        const typeIds = types.map((type) => parseUrl(type.url));

        return typeIds ? typeIds : null;
    }

    async getTypeDoubleDamageTo(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.double_damage_to;
        const typeIds = types.map((type) => parseUrl(type.url));

        return typeIds ? typeIds : null;
    }

    async getTypeHalfDamageFrom(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.half_damage_from;
        const typeIds = types.map((type) => parseUrl(type.url));

        return typeIds ? typeIds : null;
    }

    async getTypeHalfDamageTo(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.half_damage_to;
        const typeIds = types.map((type) => parseUrl(type.url));

        return typeIds ? typeIds : null;
    }

    async getTypeNoDamageFrom(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.no_damage_from;
        const typeIds = types.map((type) => parseUrl(type.url));

        return typeIds && typeIds.length ? typeIds : null;
    }

    async getTypeNoDamageTo(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const types = typeResponse.damage_relations.no_damage_to;
        const typeIds = types.map((type) => parseUrl(type.url));

        return typeIds && typeIds.length ? typeIds : null;
    }

    async getPokemonOfType(typeId) {
        const typeResponse = await this.get(`/type/${typeId}`);
        const pokemon = typeResponse.pokemon;
        const pokemonIds = pokemon.map((pokemon) =>
            parseUrl(pokemon.pokemon.url)
        );

        return pokemonIds ? pokemonIds : null;
    }

    async getEggGroupIds(pokemonId) {
        const speciesId = await this.getPokemonSpeciesId(pokemonId);
        const speciesResponse = await this.get(`/pokemon-species/${speciesId}`);
        const eggGroups = speciesResponse.egg_groups;
        const eggGroupIds = eggGroups.map((eggGroup) => parseUrl(eggGroup.url));

        return eggGroupIds ? eggGroupIds : null;
    }

    async getEggGroupName(eggGroupId) {
        const eggGroupResponse = await this.get(`/egg-group/${eggGroupId}`);

        return eggGroupResponse.name ? eggGroupResponse.name : null;
    }

    async getEggGroupPokemonIds(eggGroupId) {
        const eggGroupResponse = await this.get(`/egg-group/${eggGroupId}`);

        const pokemon = eggGroupResponse.pokemon_species;
        const pokemonIds = pokemon.map((pokemon) => parseUrl(pokemon.url));

        return pokemonIds ? pokemonIds : null;
    }

    async getMoveIds(pokemonId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);

        const moves = basicResponse.moves;
        const moveIds = moves.map((move) => parseUrl(move.move.url));

        return moveIds ? moveIds : null;
    }

    async getMoveName(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);

        return moveResponse.name ? moveResponse.name : null;
    }

    async getMoveTypeId(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);

        const moveTypeId = parseUrl(moveResponse.type.url);
        return moveTypeId ? moveTypeId : null;
    }

    // special or physical
    async getMoveDamageClass(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        const damageClass = moveResponse.damage_class.name;
        return damageClass ? damageClass : null;
    }

    async getMovePower(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        return moveResponse.power ? moveResponse.power : null;
    }

    async getMovePp(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        return moveResponse.pp ? moveResponse.pp : null;
    }

    async getMoveAccuracy(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        return moveResponse.accuracy ? moveResponse.accuracy : null;
    }

    async getMoveEffectChance(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        return moveResponse.effect_chance ? moveResponse.effect_chance : null;
    }

    async getMoveEffects(moveId) {
        const moveResponse = await this.get(`/move/${moveId}`);
        const moveEffects = moveResponse.effect_entries.map(async (effect) => {
            const moveEffectChance = await this.getMoveEffectChance(moveId);

            return effect.effect.replace("$effect_chance", moveEffectChance);
        });

        return moveEffects ? moveEffects : null;
    }

    async getMoveLearnMethodGameIds(versionGroupId) {
        const versionGroupResponse = await this.get(
            `/version-group/${versionGroupId}`
        );

        const gameIds = versionGroupResponse.versions.map((version) =>
            parseUrl(version.url)
        );

        return gameIds ? gameIds : null;
    }

    async getMoveLearnMethodNames(pokemonId, moveId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);
        const moves = basicResponse.moves;

        const desiredMove = moves.find(
            (move) => parseUrl(move.move.url) === moveId
        );

        const methodNames = desiredMove.version_group_details.map(
            (game) => game.move_learn_method.name
        );

        return methodNames ? methodNames : null;
    }

    async getMoveLearnMethods(pokemonId, moveId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);
        const moves = basicResponse.moves;

        const desiredMove = moves.find(
            (move) => parseUrl(move.move.url) === moveId
        );

        const learnMethods = desiredMove.version_group_details.map(
            async (game) => {
                const gameIds = await this.getMoveLearnMethodGameIds(
                    parseUrl(game.version_group.url)
                );

                return {
                    method: game.move_learn_method.name,
                    level_learned_at:
                        game.level_learned_at > 0
                            ? game.level_learned_at
                            : null,
                    games: gameIds,
                };
            }
        );

        return learnMethods ? learnMethods : null;
    }

    async getPokemonSprites(pokemonId) {
        const basicResponse = await this.get(`/pokemon/${pokemonId}`);

        const sprites = basicResponse.sprites;

        // if pokeapi has a null value, give it an img src (some of the pokemon have the value as null, but creating a dynamic img src does pull up the correct resource)
        if (!sprites.front_default) {
            sprites.front_default = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
        }

        return sprites ? sprites : null;
    }

    async getRegionName(regionId) {
        const regionResponse = await this.get(`/region/${regionId}`);

        return regionResponse.name ? regionResponse.name : null;
    }

    async getRegionLocations(regionId) {
        const regionResponse = await this.get(`/region/${regionId}`);

        const locationIds = regionResponse.locations.map((location) =>
            parseUrl(location.url)
        );

        return locationIds ? locationIds : null;
    }

    async getRegionGames(regionId) {
        const regionResponse = await this.get(`/region/${regionId}`);

        const gameIds = regionResponse.version_groups.map((game) =>
            parseUrl(game.url)
        );

        return gameIds ? gameIds : null;
    }

    async getGameName(gameId) {
        const gameResponse = await this.get(`/version/${gameId}`);

        return gameResponse.name ? gameResponse.name : null;
    }

    async getGameVersionGroupId(gameId) {
        const gameResponse = await this.get(`/version/${gameId}`);

        const versionGroupId = parseUrl(gameResponse.version_group.url);

        return versionGroupId ? versionGroupId : null;
    }

    async getGameGeneration(gameId) {
        const gameResponse = await this.get(`/version-group/${gameId}`);

        return gameResponse.generation.name
            ? gameResponse.generation.name
            : null;
    }

    async getGameRegions(gameId) {
        const gameResponse = await this.get(`/version-group/${gameId}`);

        const regionIds = gameResponse.regions.map((region) =>
            parseUrl(region.url)
        );

        return regionIds ? regionIds : null;
    }
}

module.exports = { PokemonAPI };
