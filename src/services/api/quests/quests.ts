import { httpService } from '@/services/http/http.service';
import type { QuestsRequest,UserDailyQuest, UserQuest  } from './models';

const spaceId = import.meta.env.VITE_SPACE_ID;
const BBSecondaryUrl = import.meta.env.VITE_BB_SECONDARY_URL;


export const questApiService = {
    getQuestsList: async (): Promise<TypedResponse<QuestsRequest>> => {
        return await httpService.get(`${spaceId}/weeks/active`, { type: 'games' })
    },
    getDailyQuests: async ():Promise<TypedResponse<UserDailyQuest[]>> => {
        return await httpService.get(`${BBSecondaryUrl}/user/my/daily-quests`);
    },
    getUserQuests: async (gameId: string, weekId: string = 'all', typeId: string = 'all'):Promise<TypedResponse<UserQuest[]>> => {
        return await httpService.post(`${spaceId}/users/my/quests`, { gameId, weekId, typeId });
    },

}
