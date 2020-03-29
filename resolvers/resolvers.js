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
            // return fetch(`${baseUrl}/pokemon/${args.number}`).then(res =>
            //     res.json()
            // );
            // return dataSources.pokemonAPI.getPokemon(args.number);
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
        evolves_to: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getWhoPokemonEvolvesTo(parent);
        },
        evolves_from: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getWhoPokemonEvolvesFrom(parent);
        },
        evolution_criteria: (parent, args, { dataSources }) => {
            return dataSources.pokemonAPI.getEvolvedAtDetails(parent);
        }

        // evolves_to: async (parent, args) => {
        //     // console.log("Pokemon evolves_to obj: ", obj);
        //     const name = parent.species.name;
        //     const speciesResJson = await fetch(parent.species.url).then(res =>
        //         res.json()
        //     );
        //     // const speciesResJson = await speciesRes.json();

        //     // console.log("speciesResJson: ", speciesResJson);

        //     const evoChainResJson = await fetch(
        //         speciesResJson.evolution_chain.url
        //     ).then(res => res.json());
        //     // const evoChainResJson = await evoChainRes.json();

        //     // console.log("evoChainResJson: ", evoChainResJson);

        //     const tierIName = evoChainResJson.chain.species.name;
        //     const tierIINamesArray = evoChainResJson.chain.evolves_to.map(
        //         pokemon => pokemon.species.name
        //     );
        //     const tierIIINamesArray = evoChainResJson.chain.evolves_to
        //         .map(tierIIPokemon => {
        //             return tierIIPokemon.evolves_to
        //                 .map(tierIIIPokemon => tierIIIPokemon.species.name)
        //                 .flat();
        //         })
        //         .flat();
        //     // console.log("tierIName: ", tierIName);
        //     // console.log("tierIINamesArray: ", tierIINamesArray);
        //     // console.log("tierIIINamesArray: ", tierIIINamesArray);

        //     let evolvesToReturnValue = null;
        //     let evoTrigger = null;
        //     let evoMethod = null;

        //     if (name === tierIName) {
        //         evolvesToReturnValue = evoChainResJson.chain.evolves_to.map(
        //             pokemon => {
        //                 const evoDetailsArr = pokemon.evolution_details.map(
        //                     detailsObj => {
        //                         // array of strings of the names of the keys
        //                         const validMethodKeyNames = Object.keys(
        //                             detailsObj
        //                         ).filter(
        //                             key =>
        //                                 detailsObj[key] &&
        //                                 detailsObj[key] !== "" &&
        //                                 key !== "trigger"
        //                         );

        //                         const validMethodsArr = validMethodKeyNames.map(
        //                             key => {
        //                                 return {
        //                                     name: key,
        //                                     value:
        //                                         typeof detailsObj[key] ===
        //                                         "object"
        //                                             ? detailsObj[key].name
        //                                             : detailsObj[key].toString()
        //                                 };
        //                             }
        //                         );

        //                         return validMethodsArr;
        //                     }
        //                 );

        //                 console.log(pokemon.species.url.split("/"));
        //                 const urlSplit = pokemon.species.url.split("/");
        //                 const pokemonId = urlSplit[urlSplit.length - 2];
        //                 console.log(pokemonId);

        //                 return pokemonId;

        //                 return {
        //                     name: pokemon.species.name,
        //                     evolution_trigger:
        //                         pokemon.evolution_details[0].trigger.name,
        //                     evolution_method: evoDetailsArr.flat()
        //                 };
        //             }
        //         );
        //     } else if (tierIINamesArray.includes(name)) {
        //         evolvesToReturnValue = evoChainResJson.chain.evolves_to
        //             .map(tierIIObj => {
        //                 return tierIIObj.evolves_to
        //                     .map(tierIIIObj => {
        //                         const name = tierIIIObj.species.name;
        //                         const trigger =
        //                             tierIIIObj.evolution_details[0].trigger
        //                                 .name;

        //                         const evoDetailsArr = tierIIIObj.evolution_details.map(
        //                             detailsObj => {
        //                                 const validMethodKeyNames = Object.keys(
        //                                     detailsObj
        //                                 ).filter(
        //                                     key =>
        //                                         detailsObj[key] &&
        //                                         detailsObj[key] !== "" &&
        //                                         key !== "trigger"
        //                                 );

        //                                 const validMethodsArr = validMethodKeyNames.map(
        //                                     key => {
        //                                         return {
        //                                             name: key,
        //                                             value:
        //                                                 typeof detailsObj[
        //                                                     key
        //                                                 ] === "object"
        //                                                     ? detailsObj[key]
        //                                                           .name
        //                                                     : detailsObj[
        //                                                           key
        //                                                       ].toString()
        //                                         };
        //                                     }
        //                                 );

        //                                 return validMethodsArr;
        //                             }
        //                         );

        //                         console.log(tierIIIObj.species.url.split("/"));
        //                         const urlSplit = tierIIIObj.species.url.split(
        //                             "/"
        //                         );
        //                         const pokemonId = urlSplit[urlSplit.length - 2];
        //                         console.log(pokemonId);

        //                         return pokemonId;

        //                         return {
        //                             name,
        //                             evolution_trigger: trigger,
        //                             evolution_method: evoDetailsArr.flat()
        //                         };
        //                     })
        //                     .flat();
        //             })
        //             .flat();
        //     }

        //     console.log("evolvesToReturnValue: ", evolvesToReturnValue);
        //     console.log(
        //         "return value evolve methods: ",
        //         evolvesToReturnValue.map(mon => mon.evolution_method)
        //     );
        //     return evolvesToReturnValue;
        // }
    }
};

module.exports = { resolvers };
