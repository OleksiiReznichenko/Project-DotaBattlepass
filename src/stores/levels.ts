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
        // Covers all 25 stages referenced by the original long map.
        // Fictional XP values only, never synchronized with the old backend.
        this.levels = Array.from({ length: 25 }, (_, index) => ({
            description: '',
            id: String(index + 1),
            levelId: index + 1,
            points: index * 150,
        }));
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
