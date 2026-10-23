import type fightEvent from '@/interfaces/fightEvent';
import type { LevelRequest } from '@/services/api/levels';

type GameAction = fightEvent['userActionType'] | 'farm' | 'go';

// XP progression is not the same as the hero physically reaching an encounter.
export const nextUnlockedEncounter = (
    events: fightEvent[], activeLevel: number, xpLevel: number
): fightEvent | undefined => events.find(event =>
    event.userLevel > activeLevel && event.userLevel <= xpLevel
);

export const demoAction = (
    events: fightEvent[], activeLevel: number, xpLevel: number, completed: number[]
): GameAction => {
    const encounter = events.find(event => event.userLevel === activeLevel);
    if (encounter && !completed.includes(activeLevel)) return encounter.userActionType;
    return nextUnlockedEncounter(events, activeLevel, xpLevel) ? 'go' : 'farm';
};

export const xpLevelForPoints = (levels: LevelRequest[], points: number): number =>
    levels.reduce((level, item) => points >= item.points ? item.levelId : level, 1);
