import { defineStore } from 'pinia'
import type fightEvent from "@/interfaces/fightEvent";
import { eventsApiService , type AllPrizesList, type LevelsForPrizes} from "@/services/api/event";

interface State {
  fightEvents: fightEvent[];
  allPrizes: AllPrizesList[],
  prizesForLevels: LevelsForPrizes[]
}

export const useEventsStore = defineStore({
  id: 'eventsStore',

  state: (): State => ({
    fightEvents: [],
    allPrizes: [ {
        createdAt: new Date,
        description: '',
        href: '',
        id: '',
        image: '',
        points: 0,
        spaceId: '',
        title: '',
        type: '',
        updatedAt: new Date
    }],
    prizesForLevels: []
  }),

  actions: {
    setEvents(userId: null | string | number | boolean): void {
        if (userId) {
            this.fightEvents = [
                {
                    id: 1,
                    name: 'Tower Radiant',
                    icon: 'Tower_Radiant',
                    myCharacterLeftPosition: 0,
                    userLevel: 1,
                    userActionType: 'getFreeSpins',
                    hp: false,
                    rouletteTaken: false,
                    awards: [
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 20
                        },
                    ],
                    sprites: null
                },
                {
                    id: 2,
                    name: 'Rune',
                    icon: 'Runes',
                    myCharacterLeftPosition: 5.4,
                    userLevel: 3,
                    userActionType: 'getRunes',
                    hp: false,
                    rouletteTaken: false,
                    awards: [
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 40
                        },
                    ],
                    sprites: {
                        folder: 'Runes',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 3,
                    name: 'Tower Radiant',
                    icon: 'Tower_Radiant',
                    myCharacterLeftPosition: 11,
                    userLevel: 5,
                    userActionType: 'getFreeSpins',
                    hp: false,
                    rouletteTaken: false,
                    awards: [
                        {
                            type: 'money',
                            amount: 200
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 60
                        },
                    ],
                    sprites: null
                },
                {
                    id: 4,
                    name: 'Tower Radiant',
                    icon: 'Tower_Radiant',
                    myCharacterLeftPosition: 17,
                    userLevel: 7,
                    userActionType: 'getFreeSpins',
                    hp: false,
                    rouletteTaken: false,
                    awards: [
                        {
                            type: 'money',
                            amount: 500
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 80
                        },
                    ],
                    sprites: null
                },
                {
                    id: 5,
                    name: 'Outworld Destroyer',
                    icon: 'Outworld_Devourer',
                    myCharacterLeftPosition: 29.5,
                    userLevel: 9,
                    userActionType: 'attack',
                    hp: true,
                    awards: [
                        {
                            type: 'money',
                            amount: 500
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 80
                        },
                    ],
                    sprites: {
                        folder: 'Outworld_Devourer',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 6,
                    name: 'Rune',
                    icon: 'Runes',
                    myCharacterLeftPosition: 38,
                    userLevel: 11,
                    userActionType: 'getRunes',
                    hp: false,
                    rouletteTaken: false,
                    awards: [
                        {
                            type: 'money',
                            amount: 1000
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 100
                        },
                    ],
                    sprites: {
                        folder: 'Runes',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 7,
                    name: 'Tower Dire',
                    icon: 'Tower_Dire',
                    myCharacterLeftPosition: 51,
                    userLevel: 13,
                    userActionType: 'attack',
                    hp: true,
                    awards: [
                        {
                            type: 'money',
                            amount: 1000
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 130
                        },
                    ],
                    sprites: {
                        folder: 'Tower_Dire',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 8,
                    name: 'Chaos Knight',
                    icon: 'Chaos_Knight',
                    myCharacterLeftPosition: 54.5,
                    userLevel: 15,
                    userActionType: 'attack',
                    hp: true,
                    awards: [
                        {
                            type: 'money',
                            amount: 1000
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 130
                        },
                    ],
                    sprites: {
                        folder: 'Chaos_Knight',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 9,
                    name: 'Tower Dire',
                    icon: 'Tower_Dire',
                    myCharacterLeftPosition: 59,
                    userLevel: 17,
                    userActionType: 'attack',
                    hp: true,
                    awards: [
                        {
                            type: 'money',
                            amount: 2000
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 150
                        },
                    ],
                    sprites: {
                        folder: 'Tower_Dire',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 10,
                    name: 'Rune',
                    icon: 'Runes',
                    myCharacterLeftPosition: 62.75,
                    userLevel: 19,
                    userActionType: 'getRunes',
                    hp: false,
                    rouletteTaken: false,
                    awards: [
                        {
                            type: 'money',
                            amount: 2000
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 150
                        },
                    ],
                    sprites: {
                        folder: 'Runes',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 11,
                    name: 'Shadow Fiend',
                    icon: 'Shadow_Fiend',
                    myCharacterLeftPosition: 67.2,
                    userLevel: 21,
                    userActionType: 'attack',
                    hp: true,
                    awards: [
                        {
                            type: 'money',
                            amount: 3000
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 200
                        },
                    ],
                    sprites: {
                        folder: 'Shadow_Fiend',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 12,
                    name: 'Tower Dire',
                    icon: 'Tower_Dire',
                    myCharacterLeftPosition: 79,
                    userLevel: 23,
                    userActionType: 'attack',
                    hp: true,
                    awards: [
                        {
                            type: 'money',
                            amount: 4000
                        },
                        {
                            type: 'spin',
                            amount: 1
                        },
                        {
                            type: 'xp',
                            amount: 200
                        },
                    ],
                    sprites: {
                        folder: 'Tower_Dire',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 13,
                    name: 'Трон',
                    icon: 'Ancient',
                    myCharacterLeftPosition: 90,
                    userLevel: 24,
                    userActionType: 'attack',
                    hp: true,
                    awards: [
                        {
                            type: 'money',
                            amount: 10000
                        },
                        {
                            type: 'coupon',
                            couponNumber: 5,
                            amount: 1
                        }
                    ],
                    sprites: {
                        folder: 'Ancient',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
            ]
        } else {
            this.fightEvents = [
                {
                    id: 1,
                    name: 'Tower Radiant',
                    icon: 'Tower_Radiant',
                    myCharacterLeftPosition: 0,
                    userLevel: 1,
                    userActionType: 'getFreeSpins',
                    hp: false,
                    rouletteTaken: false,
                    awards: [],
                    sprites: null
                },
                {
                    id: 2,
                    name: 'Rune',
                    icon: 'Runes',
                    myCharacterLeftPosition: 35,
                    userLevel: 3,
                    userActionType: 'getRunes',
                    hp: false,
                    rouletteTaken: false,
                    awards: [],
                    sprites: {
                        folder: 'Runes',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
                {
                    id: 3,
                    name: 'Outworld Destroyer',
                    icon: 'Outworld_Devourer',
                    myCharacterLeftPosition: 72.3,
                    userLevel: 4,
                    userActionType: 'attack',
                    hp: true,
                    awards: [
                        {
                            type: 'money',
                            amount: 1000
                        },
                    ],
                    sprites: {
                        folder: 'Outworld_Devourer',
                        states: {
                            idle: true,
                            death: true,
                            attack: false,
                            walk: false,
                            victory: false
                        }
                    }
                },
            ]
        }
    },
    async getAllPrizes() {
        await eventsApiService.getPrizesList()
        .then((response: TypedResponse) => {
            if(response.status === 200) {
                this.$state.allPrizes = response.data;
            }
        })
        .catch((error) => {

        })
    },
    async getPrizesForLevels() {
        await eventsApiService.getPrizesListForLevels()
        .then((response: TypedResponse) => {
            if(response.status === 200) {
                this.$state.prizesForLevels = response.data;
            }
        })
        .catch((error) => {

        }) 
    }
  }
})
