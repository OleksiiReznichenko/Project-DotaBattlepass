type PrizeRequest = {
    id: string,
    levelId: string,
    prizeId: string,
    popupShowed: boolean,
    user_prize: UserPrize,
    user_prize_value: number | null
}

type Prize = PrizeRequest & {
    amount: number,
}

type UserPrize = {
    id: string,
    image: string,
    title: string,
    description: string,
    href: string | null,
    type: string,
    prize_contains: never[]
}

type UserAcountsInfo = {
    user_twitch: {
        name: PlatformNames,
        username: string | null
    },
    user_steam: {
        name: PlatformNames,
        username: string | null
    }
}

enum PlatformNames {
    TWITCH='Twitch',
    DOTA2='Dota2'
}

type UserBaseInfo = {
    id: string,
    email: string,
    level: number,
    sum: number,
    createdAt: Date,
    updatedAt: Date
}


export type {
    PrizeRequest,
    UserPrize,
    Prize,
    UserAcountsInfo,
    UserBaseInfo,
}

export {
    PlatformNames,
}