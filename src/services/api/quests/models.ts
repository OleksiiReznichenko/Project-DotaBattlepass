type QuestsRequest = {
    id: string,
    name: string,
    image: string,
    icon: string,
    startAt: Date,
    endAt: Date,
    status: string,
    points: number,
    order: number,
    games: Games[],
    quests: Quests[]
}

type Games = {
    id: string,
    name: string,
    platform: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
    weeksGames: WeeksGames,
    gameImages: GameImages[]
}

type WeeksGames = {
    id: string,
    weekId: string,
    gameId: string,
}

type GameImages = {
    id: string,
    gameId: string,
    type: string,
    content: string
}

type Quests = {
    id: string,
    spaceId: string,
    gameId: string,
    name: string,
    description: string,
    image: string | null,
    order: number,
    difficulty: string,
    prizeId: string | null,
    points: number,
    status: string,
    category: QuestCategories,
    mode: string,
    type: string,
    createdAt: string,
    updatedAt: string,
    weeks_quests: WeeksQuests,
    quest_fields: QuestFields[],

}

enum QuestCategories {
    GAMESDAILY = 'games:daily',
    GAMESOVERALL = 'games:overall',
    SOCIALS = 'socials',
    BETBOOM = 'betboom',
}

type WeeksQuests = {
    id: string,
    weekId: string,
    questsId: string,
}

type QuestFields = {
    id: string,
    questId: string,
    fieldId: string,
    logic: string,
    value: number
}

type UserDailyQuest = {
    id: string,
    userId: string,
    questName: string,
    status: DailyQuestStatus,
    count: number,
    createdAt: Date,
    updatedAt: Date
}

enum DailyQuestStatus {
    FINISHED = 'finished',
    ACTIVE = 'active'
}

type UserQuest = {
    completed: boolean,
    createdAt: Date,
    gameId: string,
    id: string,
    questId: string,
    spaceId: string,
    updatedAt: string,
    userId: string,
    value: string,
    weekId: string,
}


export type {
    QuestsRequest,
    Quests,
    UserDailyQuest,
    UserQuest
}

export {
    QuestCategories,
    DailyQuestStatus
}