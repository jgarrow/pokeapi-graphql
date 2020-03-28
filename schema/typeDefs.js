const { gql } = require("apollo-server");

const typeDefs = gql`
    type Pokemon { # query with info wanted for my pokedex for individual Pokemon info
        id: Int # want the number that is used for the pokemon endpoint
        name: String
        nat_dex_num: Int
        main_image: String #image src url
        types: [Type] # array of Type objects
        height: Int
        weight: Int
        gender: String # if available
        category: String # if available (the puppy pokemon)
        egg_group: [EggGroup]
        abilities: [Ability] # array of Ability objects
        sprites: [Sprite] # array of Sprite objects
        base_stats: Stats # array of Stat objects
        dex_entries: [DexEntry] # array of DexEntry objects
        moves: [Move] # array of Move objects
        locations: [Location] # array of Location objects
        evolves_to: [EvolutionPokemon]

        # evolves_from: Pokemon
        # evolves_from_method: String # ex. 'level-up' , 'item'
        # evolves_from_trigger: String # ex. '16' , 'water-stone'
        # evolves_to: Pokemon
        # evolves_to_method: String # ex. 'level-up' , 'item'
        # evolves_to_trigger: [String] # ex. '16' , 'water-stone'
        evolution_tier: Int # 1, 2, or 3
        # evolution_chain: [EvolutionPokemon] # array of EvolutionPokemon objects
    }

    type Type { # Pokemon type (i.e. Grass, Electric, Water, etc)
        name: String
        id: Int
    }

    type EggGroup {
        id: Int
        name: String
        pokemon: [Pokemon] # array of pokemon in this egg group
    }

    type Ability {
        id: Int
        name: String
        effect: String
    }

    type Sprite {
        # name: String
        url: String # image src url
    }

    type EvolutionPokemon {
        name: String
        sprite: String # image src url
        evolution_method: String # ex. 'level-up' , 'item'
        evolution_trigger: String # ex. '16' , 'water-stone'
        evolution_tier: Int # 1, 2, or 3
    }

    type Stats {
        hp: Int
        attack: Int
        defense: Int
        special_attack: Int
        special_defense: Int
        speed: Int
    }

    type DexEntry {
        description: String
        game: String # game/version this entry is from
    }

    type Move {
        id: Int
        name: String
        learn_method: String # level, egg, move tutor, tm/hm
        level_learned_at: Int
        type: Type
        power: Int
        accuracy: Int
        pp: Int
        effect: String # possible status condition effect
        damage_class: String # physical or special
        description: String
    }

    type Location {
        id: Int
        name: String
        game: String # which game/version pokemon is found at this location
        pokemon: [Pokemon] # array of pokemon that can be found at this location
    }

    type Query {
        allPokemon(start: Int): [Pokemon] # get range of pokemon starting from start variable
        # game(name: String!): [Pokemon] # get pokemon from a specific game
        # generation(generationNumber: Int!): [Pokemon] # get pokemon from specific generation regardless of game
        pokemon(number: Int!): Pokemon
        ability(id: Int!): Ability
        type(id: Int!): Type
        eggGroup(id: Int!): EggGroup
        location(id: Int!): Location
        move(id: Int!): Move
    }
`;

module.exports = { typeDefs };
