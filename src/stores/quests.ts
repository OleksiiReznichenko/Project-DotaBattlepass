import { defineStore } from 'pinia'
import type fightEvent from "@/interfaces/fightEvent";
import {questApiService, QuestCategories , type QuestsRequest, type UserDailyQuest, type UserQuest} from "@/services/api/quests/index"

interface State {
    price: number | null,
    samples: any,
    data: QuestsRequest,
    questsDaily: UserDailyQuest[],
    userQuests: UserQuest[],
}

export const useQuestsStore = defineStore({
  id: 'questsStore',

  state: (): State => ({
    price: 0,
    samples: [
        {
            id: 1,
            price: 500,
            spines: 1,
            active: false
        },
        {
            id: 2,
            price: 1000,
            spines: 2,
            active: false
        },
        {
            id: 3,
            price: 5000,
            spines: 8,
            active: false
        },
        {
            id: 4,
            price: 10000,
            spines: 8,
            active: false
        },
    ],
    data: {
        id: '',
        name: '',
        image: '',
        icon: '',
        startAt: new Date(),
        endAt: new Date(),
        status: '',
        points: 0,
        order: 0,
        games: [{
            id: '',
            name: '',
            platform: '',
            status: '',
            createdAt: new Date(),
            updatedAt: new Date(),
            weeksGames: {
                id: '',
                weekId: '',
                gameId: '',
            },
            gameImages: [{
                id: '',
                gameId: '',
                type: '',
                content: ''
            }]
        }],
        quests: [{
            id: '',
            spaceId: '',
            gameId: '',
            name: '',
            description: '',
            image: null,
            order: 0,
            difficulty: '',
            prizeId: null,
            points: 0,
            status: '',
            category: QuestCategories.BETBOOM,
            mode: '',
            type: '',
            createdAt: '',
            updatedAt: '',
            weeks_quests: {
                id: '',
                weekId: '',
                questsId: '',
            },
            quest_fields: [{
                id: '',
                questId: '',
                fieldId: '',
                logic: '',
                value: 0
            }]
        }]
    } as QuestsRequest,
    questsDaily: [],
    userQuests: []
  }),

  actions: {
    setPrice(price: number): void {
        this.$state.price = price;
    },
    setActiveSample(price: number): void {
        this.$state.samples.map((item: any) => {
            if(item.price === price) {
                this.setPrice(price)
                item.active = !item.active;
            }
            else {
                item.active = false;
            }
        })
    },
    async getQuestList() {
        await questApiService.getQuestsList()
        .then((response: TypedResponse<QuestsRequest>) => {
            if(response.status === 200) {
                this.$state.data = response.data;
                this.getUserQuests();
            }
        })
        .catch((error) => {
        })
    },
    async getDailyQuests() {
        await questApiService.getDailyQuests()
        .then((response: TypedResponse<UserDailyQuest[]>) => {
            if(response.status === 200) {
                this.$state.questsDaily = response.data;
            }
        })
        .catch((error) => {
        })
    },
    async getUserQuests() {
        this.$state.userQuests = []
        const types = ['betboom', 'twitch:views', 'dota2'];
        for(let value of types) {
            const data: UserQuest[] = [];
            await questApiService.getUserQuests(value, this.$state.data.id)
            .then((response: TypedResponse<UserDailyQuest[]>) => {
                if(response.status === 200) {
                    if(response.data.length > 0) {
                        this.$state.userQuests.push(...response.data);
                    }
                }
            })
            .catch((error) => {
            })
        }
    },
},
})
