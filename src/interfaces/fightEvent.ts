import type Award from "@/interfaces/award";
import type Sprite from "@/interfaces/sprite";
export default interface fightEvent {
    id: number;
    name: string;
    icon: string;
    myCharacterLeftPosition: number;
    userLevel: number;
    userActionType: 'attack' | 'farm' | 'getRunes' | 'getFreeSpins' | 'go';
    hp?: boolean | number;
    rouletteTaken?: boolean;
    awards: Award[];
    sprites: null | Sprite;
}