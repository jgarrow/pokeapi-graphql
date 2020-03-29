const { RESTDataSource } = require("apollo-datasource-rest");
const { parseUrl } = require("../utils/parseUrl");

class PokemonAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = "https://pokeapi.co/api/v2";
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

    async getWhoPokemonEvolvesTo(id) {
        // let promise = this.memoizedResults.get(`/pokemon/${id}`);
        // if (promise) return promise;

        let evolves_to = null;

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

        // if current pokemon can evolve
        if (evolvesToIdArray.length) {
            evolves_to = await evolvesToIdArray.map(async id => {
                // to get info for evolves_to method(s) and trigger for current pokemon, look at the evolves_from_method and evolves_from_trigger for the current pokemon's `evolve_to` Pokemon

                // just getting name for now while I figure things out
                const pokemonObj = this.getPokemonName(id);
                return pokemonObj;
            });
        }
        return evolves_to;
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
        let evolves_from = null;

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

        // if current pokemon evolved from another pokemon
        if (evolvesFromId) {
            // just getting name for now while I figure things out
            evolves_from = this.getPokemonName(evolvesFromId);
        }

        return evolves_from;
    }

    async getNationalPokedexNumber(id) {
        const speciesResponse = await this.get(`/pokemon-species/${id}`);

        const dexNumbers = speciesResponse.pokedex_numbers;

        const nationalDexObj = dexNumbers.find(
            pokedex => pokedex.pokedex.name === "national"
        );

        return parseInt(nationalDexObj.entry_number);
    }

    async getPokemonLocationObjects(pokemonId) {
        return await this.get(`/pokemon/${pokemonId}/encounters`);
    }

    // can use location id to hit `/location-area/${id}` for Location type
    async getPokemonLocationId(locationObj) {
        return parseUrl(locationObj.location_area.url);
    }

    async getPokemonLocationName(locationObj) {
        return locationObj.location_area.name;
    }

    async getPokemonLocationGames(locationObj) {
        const games = locationObj.version_details.map(
            game => game.version.name
        );

        return games;
    }

    async getLocationPokemonEncounters(locationObj) {
        let pokemonEncounters = [];

        const locationAreaResponse = await this.get(
            locationObj.location_area.url
        );

        const findablePokemon = locationAreaResponse.pokemon_encounters;

        if (findablePokemon.length) {
            pokemonEncounters = findablePokemon.map(pokemon =>
                parseUrl(pokemon.pokemon.url)
            );
        }

        return pokemonEncounters;
    }
}

module.exports = { PokemonAPI };
