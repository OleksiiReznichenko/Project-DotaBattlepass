interface RouletteValue {
    value: number | string;
    amountSegments: number;
    segmentsNumbers: number[];
    probability: number;
}

export default interface Roulette {
    rouletteType: string,
    amountSegments: number;
    firstSegmentRotation: number;
    valuesInfo: RouletteValue[];
}