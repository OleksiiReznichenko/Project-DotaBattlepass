import { defineStore } from 'pinia';
import { rouletteApiService, type Roulette } from '@/services/api/roulette/index';
import type { RouletteType, RouletteOptions } from '@/services/api/roulette/index';
import { useRoulettesStore } from '@/stores/roulettes'

interface State {
  roulettes: Roulette[],
  winId: string,
  answerSuccess: null | boolean,
};

export const useRouletteStore = defineStore({
  id: 'rouletteStore',

  state: (): State => ({
    roulettes: [],
    winId: '',
    answerSuccess: null
  }),

  actions: {
    async getRoullettes() {
      await rouletteApiService.getRoulettesList()
        .then((response: TypedResponse<Roulette>)=> {
          this.$state.roulettes = response.data;
          this.spreadRouletteOptions();
          const roulettesStore = useRoulettesStore();
          roulettesStore.setRoulettes();
        });
    },
    spreadRouletteOptions() {
      this.$state.roulettes.forEach((roulette:Roulette, index: number) => {
        let newArray: RouletteOptions[] = [];
        roulette.roulette_options.forEach((item: RouletteOptions) => {
          for(let i=0; i < item.count; i++) {
            newArray.push(item);
          }
        })
        this.$state.roulettes[index].roulette_options = this.shuffleArray(newArray);
      });
    },
    shuffleArray(array: RouletteOptions[]) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
    },
    async playSpinRoulette(type: RouletteType) {
        this.$state.winId = '';
      const roulette = this.$state.roulettes.filter(item => item.name === type)[0];

      await rouletteApiService.playSpinRoulette(roulette.id)
      .then((data) => {
        if(data.success) {
          this.$state.winId = data.winId;
          const index = this.$state.roulettes.findIndex(item => item.id === roulette.id);
          this.$state.roulettes[index].state.spins -= 1;
          this.$state.answerSuccess = true;
        } else {
          this.$state.answerSuccess = false;
        }

      })
      .catch((error) => {
        this.$state.answerSuccess = false;
      })
    }
  }
})
