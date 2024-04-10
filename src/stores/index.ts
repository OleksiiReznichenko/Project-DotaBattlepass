import { defineStore } from 'pinia';
import type RouletteGottenValue from "@/interfaces/rouletteGottenValue";

interface State {
  isAwardsWindowOpened: boolean;
  awardScreenType: 'event' | 'level';
  isRouletteWindowOpened: boolean;
  goToNextEvent: boolean;
  endLightLineIndicator: boolean;
  allLevelsFinishedIndicator: boolean;
  updateProgressBarPositionIndicator: boolean;
  skipScrollIndicator: boolean;
  creepAnimationIndicator: boolean;
  stopEventsAnimationsIndicator: boolean;
  allowToOpenRoulette: boolean;
  previewClosedIndicator: boolean;
  awardsClosedIndicator: null | boolean;
  myCharacterPosition: number;
  myCharacterAction: 'attack' | 'attackFarm' | 'deathAttack' | 'walk' | 'idle' | 'victory';
  eventAction: 'damage' | 'death' | 'idle';
  currentUserAction: 'attack' | 'farm' | 'getRunes' | 'getFreeSpins' | 'go';
  rouletteGottenValue: RouletteGottenValue;
}

export const useBaseStore = defineStore({
  id: 'baseStore',

  state: (): State => ({
    isAwardsWindowOpened: false,
    awardScreenType: 'event',
    isRouletteWindowOpened: false,
    goToNextEvent: false,
    endLightLineIndicator: false,
    allLevelsFinishedIndicator: false,
    updateProgressBarPositionIndicator: true,
    skipScrollIndicator: false,
    creepAnimationIndicator: false,
    stopEventsAnimationsIndicator: false,
    allowToOpenRoulette: true,
    previewClosedIndicator: false,
    awardsClosedIndicator: false,
    myCharacterPosition: 0,
    myCharacterAction: 'idle',
    eventAction: 'idle',
    currentUserAction: 'attack',
    rouletteGottenValue: {
      finalResult: null,
      neededSegment: null,
      neededRotation: null,
    },
  }),

  actions: {
  }
})
