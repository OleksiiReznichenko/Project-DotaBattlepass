type Roulette = {
    id: string,
    name: RouletteType,
    roulette_options: RouletteOptions[],
    state: State,
}

enum RouletteType {
    RUNIC='Runic',
    FARM='Farm',
    MINE='Mine'
}

type RouletteOptions = {
    count: number,
    id: string,
    points: number,
    prizeId: string,
    roulette_options_prizeImage: {
        content: string
    }
}

type State = {
    spins: number,
    bonusSpins: number,
    spinAt: Date,
}

export type {
    Roulette,
    RouletteOptions
}

export {
    RouletteType
}