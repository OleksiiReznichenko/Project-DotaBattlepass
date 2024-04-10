import { defineStore } from 'pinia'
import type Level from "@/interfaces/level";
import type { LevelRequest } from '@/services/api/levels';
import { levelsApiService } from '@/services/api/levels';

interface State {
    levelsOld: Level[];
    levels: LevelRequest[],
}

export const useLevelsStore = defineStore({
  id: 'levelsStore',

  state: (): State => ({
    levelsOld: [],
    levels: [],
  }),

  actions: {
    setStaticLevels() {
        this.levels = [
            {
                description: '',
                id: '1',
                levelId: 1,
                points: 0,
            },
            {
                description: '',
                id: '2',
                levelId: 2,
                points: 150,
            },
            {
                description: '',
                id: '3',
                levelId: 3,
                points: 300,
            },
            {
                description: '',
                id: '4',
                levelId: 4,
                points: 500,
            },
            {
                description: '',
                id: '5',
                levelId: 5,
                points: 650,
            }
        ]
    },
    async getLevels() {
        await levelsApiService.getLevels()
        .then((response: TypedResponse<LevelRequest[]>) => {
            if(response.status === 200) {
                this.levels = response.data;
            }
        })
    }
  }
})
