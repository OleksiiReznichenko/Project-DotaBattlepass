import { httpService } from '@/services/http/http.service';
import type { Roulette } from './models';
import { BetboomIntegrate } from '@mymap/betboom-integrate';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const spaceId = import.meta.env.VITE_SPACE_ID;
const betboomIntegrate = new BetboomIntegrate({
  betboomAuthServiceUrl: import.meta.env.VITE_BB_SERVICE_URL,
});

export const rouletteApiService = {
  getRoulettesList: async (): Promise<TypedResponse<Roulette>> => {
    return await httpService.post(`${spaceId}/roulette/get/list`, {});
  },
  playSpinRoulette: async (id: string): Promise<any> => {
    const authStore = useAuthStore();
    const {
      token: { value: token },
    } = storeToRefs(authStore);

    return await betboomIntegrate.playBattlepassRoulette(token, id);
  },
};
