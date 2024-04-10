type AllPrizesList = {
    createdAt: Date,
    description: string,
    href: string,
    id: string,
    image: string,
    points: number,
    spaceId: string,
    title: string,
    type: string,
    updatedAt: Date,
}

type LevelsForPrizes = {
    id: string,
    levelId: number,
    levelPrizes: LevelPrizes[],
}

type LevelPrizes = {
    description: string,
    href: string,
    id: string,
    image: string,
    title: string,
    type: string,
}

export type {
    AllPrizesList,
    LevelsForPrizes
}