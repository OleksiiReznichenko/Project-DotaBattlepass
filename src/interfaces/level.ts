import type Award from "@/interfaces/award";
export default interface Level {
    level: number;
    xp: number;
    totalXp: number;
    levelAwards: null | Award[];
}