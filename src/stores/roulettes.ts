import { useEventsStore } from './events';
import { defineStore, storeToRefs } from 'pinia';
import type Roulette from '@/interfaces/roulette';
import type RouletteGottenValue from "@/interfaces/rouletteGottenValue";
import { useRouletteStore } from '@/stores/roulette';
import { useAuthStore } from '@/stores/auth';

interface State {
  roulettAttackFarm: Roulette;
  roulettFreeSpins: Roulette;
  roulettRunes: Roulette;
}

export const useRoulettesStore = defineStore({
  id: 'roulettesStore',

  state: (): State => ({
    roulettAttackFarm: {
        rouletteType: 'attackFarm',
        amountSegments: 12,
        firstSegmentRotation: 15,
        valuesInfo: [
            {
                value: 50,
                amountSegments: 5,
                segmentsNumbers: [1, 5, 9, 10, 12],
                probability: 0.55
            },
            {
                value: 100,
                amountSegments: 4,
                segmentsNumbers: [2, 4, 6, 8],
                probability: 0.25
            },
            {
                value: 150,
                amountSegments: 2,
                segmentsNumbers: [3, 7],
                probability: 0.15
            },
            {
                value: 200,
                amountSegments: 1,
                segmentsNumbers: [11],
                probability: 0.05
            },
        ]
    },
    roulettFreeSpins: {
        rouletteType: 'freeSpins',
        amountSegments: 12,
        firstSegmentRotation: 15,
        valuesInfo: [
            {
                value: 1,
                amountSegments: 1,
                segmentsNumbers: [1, 3, 5, 7, 9, 10],
                probability: 0.75
            },
            {
                value: 2,
                amountSegments: 4,
                segmentsNumbers: [2, 4, 8, 12],
                probability: 0.2
            },
            {
                value: 3,
                amountSegments: 1,
                segmentsNumbers: [6, 11],
                probability: 0.05
            },
        ]

    },
    roulettRunes: {
        rouletteType: 'runes',
        amountSegments: 12,
        firstSegmentRotation: 15,
        valuesInfo: [
            {
                value: 'RuneSorcery',
                amountSegments: 5,
                segmentsNumbers: [2, 5, 6, 9, 11],
                probability: 0.5
            },
            {
                value: 'RuneWater',
                amountSegments: 4,
                segmentsNumbers: [1, 4, 7, 10],
                probability: 0.35
            },
            {
                value: 'RuneDoubleDamage',
                amountSegments: 2,
                segmentsNumbers: [3, 12],
                probability: 0.1
            },
            {
                value: 'RuneHaste',
                amountSegments: 1,
                segmentsNumbers: [8],
                probability: 0.05
            },
        ]

    },
  }),

    actions: {
        generateRotationAndValue(roulette: Roulette, isLoggedIn: boolean): RouletteGottenValue {
            let finalResult: number | string | "RuneSorcery" | "RuneWater" | "RuneDoubleDamage" | "RuneHaste" | null = null;
            let neededSegment = 1;
            if (isLoggedIn) {
                const rouletteStore = useRouletteStore();
                const { winId, roulettes } = storeToRefs(rouletteStore);

                const eventsStore = useEventsStore();
                const { allPrizes } = storeToRefs(eventsStore);

                for(let i=0; i<3;i++) {            
                    let prizeId = roulettes.value[i].roulette_options.filter(item => item.id === winId.value)[0]?.prizeId;
                    if(prizeId) {
                        let prize = allPrizes.value.filter(item => item.id === prizeId)[0]
                        if(prize) {
                            if(i===0) {
                                finalResult = prize.title;
                            }
                            if(i===1) {
                                finalResult = prize.points;
                            }
                            if(i===2) {
                                finalResult = +prize.type.split(':')[2] || 1;
                            }
                            break;
                        }
                    }
                }

                const finalResultObject = roulette.valuesInfo.find(el => {
                    return el.value === finalResult;
                })
                const neededSegmentIndex = Math.floor(Math.random() * finalResultObject!.amountSegments);
                neededSegment = finalResultObject!.segmentsNumbers[neededSegmentIndex];
            } else {
                if (roulette.rouletteType === 'attackFarm') {
                    finalResult = 150;
                    neededSegment = 7;
                } else if (roulette.rouletteType === 'freeSpins') {
                    finalResult = 3;
                    neededSegment = 6;
                } else if (roulette.rouletteType === 'runes') {
                    finalResult = 'RuneWater';
                    neededSegment = 1;
                }
            }

            let neededRotation = 0;
            if (neededSegment) {
                neededRotation = -(360 * 5 + neededSegment * (360 / roulette.amountSegments) - 15);
            }

            return {finalResult, neededSegment, neededRotation};
        },
        async setRoulettes() {
            const rouletteStore = useRouletteStore();
            const { roulettes } = storeToRefs(rouletteStore);

            const eventsStore = useEventsStore();
            await eventsStore.getAllPrizes();
            const { allPrizes } = storeToRefs(eventsStore);
            
            for(let j=0; j<3;j++) {
                let newArray: any = [];
                let rouletteOptions = roulettes.value[j].roulette_options;
                for(let i=0; i<rouletteOptions.length; i++) {
                    let element = allPrizes.value.filter(prize => prize.id === rouletteOptions[i].prizeId)[0];
                    if(j==0) {
                        newArray.push({
                            value: element.title,
                            amountSegments: 1,
                            segmentsNumbers: [i + 1],
                            probability: 100/12,
                        })
                    }
                    if(j==2) {
                        newArray.push({
                            value: +element.type.split(':')[2] || 1,
                            amountSegments: 1,
                            segmentsNumbers: [i + 1],
                            probability: 100/12,
                        })
                    }
                    else {
                        newArray.push({
                            value: element.points,
                            amountSegments: 1,
                            segmentsNumbers: [i + 1],
                            probability: 100/12,
                        })
                    }
                }
                if(j==2) {
                    this.$state.roulettFreeSpins.valuesInfo = newArray;
                }
                if(j==1) {
                    this.$state.roulettAttackFarm.valuesInfo = newArray;
                }
                if(j==0) {
                    this.$state.roulettRunes.valuesInfo = newArray;
                }
            }
        }
    }
})