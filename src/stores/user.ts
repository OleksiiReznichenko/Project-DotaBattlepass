import { storageService } from './../services/local-storage/storage-service';
import { defineStore } from 'pinia';
import type { PrizeRequest, Prize, UserAcountsInfo, UserBaseInfo } from '@/services/api/user/index';
import { PlatformNames } from '@/services/api/user/index';
import { userApiService } from '@/services/api/user/index';
import type { UserInfo, UserData } from '@/services/api/auth/models';

interface State {
  spinsAmount: number,
  prizes: Prize[],
  accounts: UserAcountsInfo,
  user: UserData,
  userInfo: UserInfo,
  userBaseInfo: UserBaseInfo,
  ladders: Array<Array<number>>,
  luckMoney: number,
  steps: number,
}

export const useUserStore = defineStore({
  id: 'UserStore',

  state: (): State => ({
    spinsAmount: 2,
    prizes: [],
    accounts: {
      user_twitch: {
        name: PlatformNames.TWITCH,
        username: null
      },
      user_steam: {
        name: PlatformNames.DOTA2,
        username: null
      }
    },
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
      level: 0
    } as UserData,
    userInfo: {
      createAt: new Date(),
      email: '',
      emailVerified: false,
      firstName: null,
      id: '',
      language: '',
      lastname: null,
      timezone: '',
      updatedAt: '',
      username: '',
    } as UserInfo,
    userBaseInfo: {
      id: '',
      email: '',
      level: 0,
      sum: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ladders: [[]],
    luckMoney: 0,
    steps: 0,
  }),

  actions: {
    async getUserInfo() {
      await userApiService.getMe()
      .then((response: TypedResponse<UserInfo>) => {
        if(response.status === 200) {
          this.$state.user = response.data;
        }
      })
    },
    async getUser() {
      await userApiService.me()
      .then((response: TypedResponse<UserData>) => {
        if(response.status === 200) {
          this.$state.userInfo = response.data;
        }
      })
      .catch((error) => {
      })
    },
    async getPrizes() {
      await userApiService.getPrizesList()
      .then((response: TypedResponse<PrizeRequest[]>) => {
        if(response.status === 200) {
          this.setPrizes(response.data);
        }
      })
      .catch((error) => {
        
      })
    },
    setPrizes(data: PrizeRequest[]): void {
      this.$state.prizes = [];
      for(let i=0; i<data.length;i++) {
        let samePrize=1;
        for(let j=i+1; j<data.length-1;j++ ) {
          if(data[i].prizeId === data[j].prizeId) 
          {
            samePrize++;
          }
        }
        if(this.$state.prizes.findIndex(item => item.prizeId === data[i].prizeId) === -1) {
          this.$state.prizes.push({ amount: samePrize, ...data[i]})
        }
      }
    },
    async getUserAccountsInfo() {
      await userApiService.getAccountsInfo()
      .then((response: TypedResponse<UserAcountsInfo>) => {
        if(response.status === 200) {
          this.$state.accounts.user_steam.username = response.data.user_steam?.username;
          this.$state.accounts.user_twitch.username = response.data.user_twitch?.username;
        }
      })
      .catch((error) => {

      })
    },
    async getUserBaseInfo() {
      await userApiService.getUserBaseInfo()
      .then((response: TypedResponse<UserBaseInfo>) => {
        if(response.status === 200) {
          this.$state.userBaseInfo = response.data; 
          this.getLadders();
        }
      })
      .catch((error) => {

      })
    },
    async getLadders() {
      await userApiService.getLadders()
      .then((response: TypedResponse<UserBaseInfo>) => {
        if(response.status === 200) {
          this.$state.ladders = response.data;
          this.setBetData();
        }
      })
      .catch((error) => {

      })
    },
    setBetData() {
      this.$state.steps = 0;
      this.$state.luckMoney = 0;

      let curSum = this.$state.userBaseInfo.sum;
      let prevSum = 0;

      for(const item of this.$state.ladders) {
        
        if(item[0] >= this.userBaseInfo.level + 1) {
          
          if(this.$state.userBaseInfo.sum < item[1] ) {
            this.$state.luckMoney = item[1] - this.$state.userBaseInfo.sum;
            this.$state.steps = item[2];
            break;
          }
          if(curSum >= item[1] - prevSum) {
            curSum = curSum - item[1] - prevSum;
            prevSum = item[1];
            this.$state.steps = item[2]; 
          }
          else {
            this.$state.steps = item[2];
            let curIndex = this.$state.ladders.findIndex((elem: number[]) => elem[1] === item[1]);
            this.$state.luckMoney = this.$state.ladders[curIndex + 2][1] - this.$state.userBaseInfo.sum;
            break;
          }
        }
      };

    },
  }
})
