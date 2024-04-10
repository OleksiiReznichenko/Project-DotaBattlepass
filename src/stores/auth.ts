import { defineStore } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useRouletteStore } from '@/stores/roulette';
import { useEventsStore } from '@/stores/events';
import { authApiService, type UserData } from '@/services/api/auth/index';
import { useQuestsStore } from '@/stores/quests';

interface State {
  jobId: string;
  user: UserData;
  isRegistered: boolean;
  token: string | null;
}

export const useAuthStore = defineStore({
  id: 'authStore',

  state: (): State => ({
    jobId: '',
    user: {
      id: '',
      points: 0,
      balance: 0,
      lastSeen: new Date(),
      userId: '',
      spaceId: '',
      levelId: '',
      createdAt: '',
      updatedAt: '',
      level: 0,
    } as UserData,
    isRegistered: false,
    token: null,
    // token: 'e586519d-5932-4ce3-9fd4-246e6fde5a3e',
  }),

  actions: {
    async login(zone: string, token: string) {
      await authApiService
        .authorization(zone, token)
        .then((response: any) => {
          this.$state.user = response.data;
          this.$state.token = response.jwsToken;
          this.$state.isRegistered = response.success;

          //////////////////////////////////////////////////
          let mymapPixelImg = document.createElement('img');
          mymapPixelImg.setAttribute(
            'src',
            `https://id.mymap.online/set-jws?token=${response.jwsToken}`
          );
          mymapPixelImg.style.width = '0';
          mymapPixelImg.style.height = '0';
          document.body.appendChild(mymapPixelImg);
          //////////////////////////////////////////////////

          // location.reload();

          const route = window.location.pathname;

          if (route === '/') {
            useUserStore().getUser();
            useUserStore().getUserInfo();
            useRouletteStore().getRoullettes();
            useEventsStore().getPrizesForLevels();
          }
          if (route === '/tasks') {
            const questsStore = useQuestsStore();
            questsStore.getQuestList();

            const rouletteStore = useRouletteStore();
            rouletteStore.getRoullettes();

            const userStore = useUserStore();
            userStore.getUserBaseInfo();
          }

          if (route === '/account') {
            const userStore = useUserStore();
            userStore.getPrizes();
            userStore.getUserAccountsInfo();
          }
        })
        .catch((error) => {
          this.$state.isRegistered = false;
        });
    },
  },
});
