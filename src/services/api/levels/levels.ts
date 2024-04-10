import { httpService } from '@/services/http/http.service';
import type { LevelRequest } from './models';

const spaceId = import.meta.env.VITE_SPACE_ID;

export const levelsApiService = {
    getLevels: async (): Promise<TypedResponse<LevelRequest[]>> => {
        return await httpService.get(`${spaceId}/levels`)
    },
}
