export default interface RouletteGottenValue {
    finalResult: null | undefined | number | string | 'RuneSorcery' | 'RuneWater' | 'RuneDoubleDamage' | 'RuneHaste',
    neededSegment: null | number,
    neededRotation: null | number,
  }