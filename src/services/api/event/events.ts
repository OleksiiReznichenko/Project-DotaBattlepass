import { httpService } from '@/services/http/http.service';
import type { AllPrizesList, LevelsForPrizes } from './models';

const spaceId = import.meta.env.VITE_SPACE_ID;

export const eventsApiService = {
    getPrizesList: async (): Promise<TypedResponse<AllPrizesList>> => {
        return await httpService.get(`${spaceId}/prizes`, { byLevels: false});
    },
    getPrizesListForLevels: async (): Promise<TypedResponse<LevelsForPrizes>> => {
        return await httpService.get(`${spaceId}/prizes`, { byLevels: true});
    }
}
