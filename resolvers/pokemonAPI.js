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

    async getPokemon(id) {
        const pokemonData = {
            id: null,
            name: null,
            height: null,
            weight: null,
            nat_dex_num: null,
            egg_group: null,
            abilities: null,
            sprites: null,
            base_stats: null,
            dex_entries: null,
            moves: null,
            locations: null,
            evolves_to: null,
            evolves_from: null
        };

        console.log("basic endpoint: ", `/pokemon/${id}`);
        const basicResponse = await this.get(`/pokemon/${id}`);

        pokemonData.id = basicResponse.id;
        pokemonData.name = basicResponse.name;
        pokemonData.height = basicResponse.height;
        pokemonData.weight = basicResponse.weight;

        const speciesResponse = await this.get(`/pokemon-species/${id}`);

        const evolutionChainResponse = await this.get(
            speciesResponse.evolution_chain.url
        );

        // an array because a pokemon has potential to evolve to multiple other pokemon (i.e. eevee, kirlia, snorunt)
        const evolvesToIdArray = this.getEvolvesToPokemonId(
            pokemonData.name,
            evolutionChainResponse
        );

        // now need to recursively call getPokemon for each id in evolvesToIdArray to get the Pokemon object for each pokemon that the current pokemon can evolve to

        // not an array because a pokemon can only evolve from 1 pokemon
        const evolvesFromId = this.getEvolvesFromPokemonId(
            pokemonData.name,
            evolutionChainResponse
        );

        // now need to recursively call getPokemon for evolvesFromId to get the Pokemon object for the pokemon that the current pokemon evolves from

        return pokemonData;
    }
}

module.exports = { PokemonAPI };
