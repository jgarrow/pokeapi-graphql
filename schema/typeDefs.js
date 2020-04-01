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
        egg_groups: [EggGroup]
        abilities: [Ability] # array of Ability objects
        sprites: Sprites # array of Sprite objects
        base_stats: Stats # array of Stat objects
        pokedex_entries: [DexEntry] # array of DexEntry objects
        moves: [Move] # array of Move objects
        locations: [Location] # array of Location objects
        evolves_from: Pokemon
        evolution_criteria: [EvolutionCriteria]
        evolution_trigger: String
        evolves_to: [Pokemon]
    }

    type Type { # Pokemon type (i.e. Grass, Electric, Water, etc)
        name: String
        id: Int
        double_damage_from: [Type]
        double_damage_to: [Type]
        half_damage_from: [Type]
        half_damage_to: [Type]
        no_damage_from: [Type]
        no_damage_to: [Type]
        pokemon: [Pokemon]
    }

    type EggGroup {
        id: Int
        name: String
        pokemon: [Pokemon] # array of pokemon in this egg group
    }

    type Ability {
        id: Int
        name: String
        is_hidden: Boolean
        effects: [String]
        pokemon: [Pokemon]
    }

    type Sprites {
        back_default: String
        back_female: String
        back_shiny: String
        back_shiny_female: String
        front_default: String
        front_female: String
        front_shiny: String
        front_shiny_female: String
    }

    type EvolutionCriteria {
        name: String # item
        value: String # thunder-stone
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
        type: Type
        learn_methods: [MoveLearnMethod] # level, egg, move tutor, tm/hm
        # level_learned_at: Int
        power: Int
        accuracy: Int
        pp: Int
        effects: [String] # possible status condition effect
        damage_class: String # physical or special
        # description: String
    }

    type MoveLearnMethod {
        method: String
        level_learned_at: Int
        game: String
    }

    type Location {
        id: Int # for the /location-area/id endpoint
        # location_area_id: Int # for the /location/id endpoint
        name: String
        region: Region
        games: [Game] # which game/version pokemon is found at this location
        pokemon: [Pokemon] # array of pokemon that can be found at this location
    }

    type Region {
        id: Int
        name: String
        games: [Game]
        locations: [Location]
    }

    type Game {
        id: Int
        name: String
        generation: String
        regions: [Region]
    }

    type Query {
        allPokemon(start: Int, end: Int): [Pokemon] # get range of pokemon starting from start variable
        allAbilities(start: Int, end: Int): [Ability]
        allTypes(start: Int, end: Int): [Type]
        allEggGroups(start: Int, end: Int): [EggGroup]
        allLocations(start: Int, end: Int): [Location]
        allMoves(start: Int, end: Int): [Move]
        allRegions(start: Int, end: Int): [Region]
        allGames(start: Int, end: Int): [Game]
        # game(name: String!): [Pokemon] # get pokemon from a specific game
        # generation(generationNumber: Int!): [Pokemon] # get pokemon from specific generation regardless of game
        pokemon(number: Int!): Pokemon
        ability(id: Int!): Ability
        type(id: Int!): Type
        eggGroup(id: Int!): EggGroup
        location(id: Int!): Location
        move(id: Int!): Move
        region(id: Int!): Region
        game(id: Int): Game
    }
`;

module.exports = { typeDefs };
