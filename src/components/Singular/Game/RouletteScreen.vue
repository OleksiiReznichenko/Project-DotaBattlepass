<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useLevelsStore } from '@/stores/levels';
import { useEventsStore } from '@/stores/events';
import { useRouletteStore } from '@/stores/roulette';
import Roulette from "@/components/Reusable/Game/Roulette.vue";
import { RouletteType } from '@/services/api/roulette';

const baseStore = useBaseStore();
const { 
    isRouletteWindowOpened, currentUserAction, rouletteGottenValue, isAwardsWindowOpened, 
    skipScrollIndicator, myCharacterAction, creepAnimationIndicator, updateProgressBarPositionIndicator,
    goToNextEvent, eventAction, allowToOpenRoulette
    } = storeToRefs(baseStore);
// const roulettesStore = useRoulettesStore();
// const { roulettAttackFarm, roulettFreeSpins, roulettRunes } = storeToRefs(roulettesStore);
const rouletteStore = useRouletteStore();
const { roulettes, winId, answerSuccess } = storeToRefs(rouletteStore);

const userStore = useUserStore();
const { user, spinsAmount } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const levelsStore = useLevelsStore();
const { levels } = storeToRefs(levelsStore);

const eventsStore = useEventsStore();
const { fightEvents } = storeToRefs(eventsStore);

let isRareValue = ref<boolean>(false);
let showAwardIndicator = ref<boolean>(false);
let removeClosedIndicator = ref<boolean>(false);

let runeDescription = ref<null | string>(null);
let ddRuneIndicator = ref<boolean>(false);

const gottenValue = computed(() => {
    if (currentUserAction.value === 'attack' || currentUserAction.value === 'farm') {
        if (rouletteGottenValue.value.finalResult === 200 || rouletteGottenValue.value.finalResult === 150) {
            isRareValue.value = true;
        } else {
            isRareValue.value = false;
        }

        let valueText = ' XP';
        if (currentUserAction.value === 'attack') {
            valueText = ' DMG';
        } else if (currentUserAction.value === 'farm') {
            valueText = ' XP';
        }

        return rouletteGottenValue.value.finalResult + valueText;
    } else if (currentUserAction.value === 'getFreeSpins') {
        
        if (rouletteGottenValue.value.finalResult === 3) {
            isRareValue.value = true;
        } else {
            isRareValue.value = false;
        }

        let spinText = ' moves';

        if (rouletteGottenValue.value.finalResult === 1) {
            spinText = ' move';
        }

        return rouletteGottenValue.value.finalResult + spinText;
    } else if (currentUserAction.value === 'getRunes') {
        
        if (rouletteGottenValue.value.finalResult === 'RuneDoubleDamage') {
            // runeDescription.value = 'Получи удвоение следующей атаки или фарма';
            runeDescription.value = 'Get double your next attack or farm';
            // return 'Руна 2x урона';
            return 'Rune 2x damage';
        } else if (rouletteGottenValue.value.finalResult === 'RuneWater') {
            // runeDescription.value = 'Получи 200 ХР';
            runeDescription.value = 'Get 200 ХР';
            // return 'Руна 200 XP';
            return 'Rune 200 XP';
        } else if (rouletteGottenValue.value.finalResult === 'RuneSorcery') {
            // runeDescription.value = 'Получи 1 бесплатную прокрутку';
            runeDescription.value = 'Get 1 free spin';
            // return 'Руна 1 ход';
            return 'Rune 1 move';
        } else if (rouletteGottenValue.value.finalResult === 'RuneHaste') {
            // runeDescription.value = 'Получи 2 бесплатных прокрутки';
            runeDescription.value = 'Get 2 free spins';
            // return 'Руна 2 хода';
            return 'Rune 2 moves';
        }

    }
    return null;
})

const skipScroll = (): void => {
    skipScrollIndicator.value = true;
};

let timeout1 = ref<any>(null);
let timeout2 = ref<any>(null);
let timeout3 = ref<any>(null);
let timeoutCloseWindow = ref<any>(null);

watchEffect(() => {
    if (answerSuccess.value === false) {
        isRouletteWindowOpened.value = false;
        answerSuccess.value = null;
        return;
    }
    if (!winId.value && isRegistered.value) return;
    if (skipScrollIndicator.value) {
        clearTimeout(timeout1.value);
        clearTimeout(timeout2.value);
        clearTimeout(timeout3.value);
        showAwardIndicator.value = true;
        removeClosedIndicator.value = true;
        timeoutCloseWindow.value = setTimeout(() => {
            if (isRouletteWindowOpened.value) {
                closeWindow();
            }
            timeoutCloseWindow.value = null;
        }, 1500);
        return;
    }
    if (!isRouletteWindowOpened.value) return;
    // removeClosedIndicator.value = false;
    timeout1.value = setTimeout(() => {
        if (isRouletteWindowOpened.value) {
            showAwardIndicator.value = true;            
        }
        timeout1.value = null;
    }, 4500);
    timeout2.value = setTimeout(() => {
        if (isRouletteWindowOpened.value) {
            removeClosedIndicator.value = true;
        }
        timeout2.value = null;
    }, 4600);
    timeout3.value = setTimeout(() => {
        if (isRouletteWindowOpened.value) {
            closeWindow();
        }
        timeout3.value = null;
    }, 8500);
});

const openAwardsWindow = (): void => {
    setTimeout(() => {
        // awardScreenType.value = awardType;
        isAwardsWindowOpened.value = true;
    }, 500);
};

const freeSpinsSpins = ref<number>(0);
const runesSpins = ref<number>(0);

watchEffect(() => {
    if (!roulettes.value || roulettes.value.length < 1) return;
    runesSpins.value = roulettes.value.find(el => {
        return el.name === RouletteType.RUNIC;
    })!.state.spins;

    freeSpinsSpins.value = roulettes.value.find(el => {
        return el.name === RouletteType.MINE;
    })!.state.spins;
})

watch(isRouletteWindowOpened, (newValue) => {
    if (!newValue) {
        showAwardIndicator.value = false;
    }
})

watch(showAwardIndicator, (newValue) => {
    if (newValue && !isRouletteWindowOpened.value) {
        showAwardIndicator.value = false;
    }
    // console.log('showAwardIndicator', newValue, isRouletteWindowOpened.value)
})

const closeWindow = (): void => {
    // if (!showAwardIndicator.value) return;
    if (!showAwardIndicator.value || !isRouletteWindowOpened.value) return;
    // console.log('CLOSE')
    isRouletteWindowOpened.value = false;
    const initialAction = currentUserAction.value;
    
    if (initialAction === 'farm') {
        creepAnimationIndicator.value = true;
    }
    
    setTimeout(() => {
        skipScrollIndicator.value = false;
        let currentEvent = fightEvents.value.find(el => {
            return el.userLevel === user.value.level;
        })
        const currentLevel = levels.value.find(el => {
            return el.levelId === user.value.level;
        })!;
        let nextLevel = levels.value.find(el => {
            return el.levelId === user.value.level + 1;
        })!;
        const nextEvent = fightEvents.value.find(el => {
            return el.userLevel === user.value.level + 1;
        })!;

        if (!nextLevel) {
            nextLevel = currentLevel;
        }
        // if (currentUserAction.value === 'attack') {
        //     if (user.value.currentEventHp && rouletteGottenValue.value.finalResult && typeof rouletteGottenValue.value.finalResult === 'number') {
        //         if (user.value.currentEventHp - rouletteGottenValue.value.finalResult <= 0) {
        //             currentUserAction.value = 'farm';
        //             if (isRegistered.value) {
        //                 openAwardsWindow();
        //             }
        //         }
        //     }
        //     myCharacterAction.value = 'attack';
        // }
        if (currentUserAction.value === 'farm' || currentUserAction.value === 'attack') {
            // myCharacterAction.value = 'attack';
            if (typeof rouletteGottenValue.value.finalResult === 'number') {
                if (currentUserAction.value === 'attack') {
                    myCharacterAction.value = 'attack';
                    eventAction.value = 'damage';
                } else if (currentUserAction.value === 'farm') {
                    myCharacterAction.value = 'attackFarm';
                    eventAction.value = 'idle';
                }
                
                if (nextLevel.points - (user.value.points + rouletteGottenValue.value.finalResult) <= 0) {
                    if (isRegistered.value && currentUserAction.value === 'attack') {
                        myCharacterAction.value = 'deathAttack';
                        eventAction.value = 'death';
                    }
                    // if (currentUserAction.value === 'attack') {
                        // openAwardsWindow();
                    // } else {
                    let timeoutTime = 2000;

                    if (currentEvent?.name === 'Outworld Destroyer') {
                        if (isRegistered.value) {
                            timeoutTime = 6500;
                        } else {
                            timeoutTime = 0;
                        }
                    } else if (currentEvent?.name === 'Shadow Fiend') {
                        timeoutTime = 3500;
                    } else if (currentEvent?.name === 'Chaos Knight') {
                        timeoutTime = 2600;
                    }

                    setTimeout(() => {
                        allowToOpenRoulette.value = true;
                        openAwardsWindow();
                    }, timeoutTime);

                    if (user.value.level !== 0 && user.value.level !== 1) {
                        if (nextEvent) {
                            currentUserAction.value = 'go';
                            if (user.value.level < 1) {
                                goToNextEvent.value = true;
                                currentUserAction.value = nextEvent.userActionType;
                                updateProgressBarPositionIndicator.value = true;
                            }
                        } else {
                            currentUserAction.value = 'farm';
                        }
                    }
                } else {
                    setTimeout(() => {
                        allowToOpenRoulette.value = true;
                    }, 2000);
                }

                if (ddRuneIndicator.value) {
                    if (rouletteGottenValue.value.finalResult < 10) return;
                    user.value.points += rouletteGottenValue.value.finalResult * 2;
                    ddRuneIndicator.value = false;
                } else {
                    if (rouletteGottenValue.value.finalResult < 10) return;
                    user.value.points += rouletteGottenValue.value.finalResult;
                }

                if (nextLevel.points - user.value.points <= 0) {
                    user.value.level += 1;
                }

                currentEvent = fightEvents.value.find(el => {
                    return el.userLevel === user.value.level;
                })
                        
                if (currentEvent && currentUserAction.value !== 'go') {
                    if (currentEvent.userActionType === 'getFreeSpins' && (currentEvent?.rouletteTaken || freeSpinsSpins.value < 1) ||
                    currentEvent.userActionType === 'getRunes' && (currentEvent?.rouletteTaken || runesSpins.value < 1)) {
                        currentUserAction.value = 'farm';
                        return;
                    }
                    currentUserAction.value = currentEvent.userActionType;
                }
            }
        } else if (currentUserAction.value === 'getFreeSpins') {
            if (typeof rouletteGottenValue.value.finalResult !== 'number') return;
            currentUserAction.value = 'farm';
            myCharacterAction.value = 'idle';
            allowToOpenRoulette.value = true;
            // openAwardsWindow();
            if (!isRegistered.value) {
                spinsAmount.value += rouletteGottenValue.value.finalResult;
            }
            // user.value.spins += rouletteGottenValue.value.finalResult;
            currentEvent!.rouletteTaken = true;
        } else if (currentUserAction.value === 'getRunes') {
            if (typeof rouletteGottenValue.value.finalResult !== 'string') return;
            currentUserAction.value = 'farm';
            myCharacterAction.value = 'idle';
            allowToOpenRoulette.value = true;
            // openAwardsWindow();
            if (rouletteGottenValue.value.finalResult === 'RuneSorcery') {
                // user.value.spins += 1;
            // openAwardsWindow();
                if (!isRegistered.value) {
                    spinsAmount.value += 1;
                }
            } else if (rouletteGottenValue.value.finalResult === 'RuneHaste') {
                // user.value.spins += 2;
                if (!isRegistered.value) {
                    spinsAmount.value += 2;
                }
            } else if (rouletteGottenValue.value.finalResult === 'RuneWater') {
                const currentLevel = levels.value.find(el => {
                    return el.levelId === user.value.level + 1;
                })!;
                user.value.points += 200;

                if (currentLevel.points - user.value.points <= 0) {
                    const nextEvent = fightEvents.value.find(el => {
                        return el.userLevel === user.value.level + 1;
                    })!;

                    // if (!)
                    user.value.level += 1;
                    openAwardsWindow();
                    if (nextEvent) {
                        currentUserAction.value = 'go';
                    }
                    // user.value.level += 1;
                }
            } else if (rouletteGottenValue.value.finalResult === 'RuneDoubleDamage') {
                ddRuneIndicator.value = true;
            }
            currentEvent!.rouletteTaken = true;
        }

        currentEvent = fightEvents.value.find(el => {
            return el.userLevel === user.value.level;
        });
        if (!currentEvent && currentUserAction.value !== 'go') {
            currentUserAction.value = 'farm';
        }
        runeDescription.value = null;
        rouletteGottenValue.value.finalResult = null;
        rouletteGottenValue.value.neededSegment = null;
        rouletteGottenValue.value.neededRotation = null;
        removeClosedIndicator.value = false;
        showAwardIndicator.value = false;
        rouletteStore.getRoullettes();
    }, 200);
};

const closeWindowOnWrapper = (event: Event): void => {
    if (!winId.value && isRegistered.value) return;
    if (!skipScrollIndicator.value) {
        skipScroll();
        timeoutCloseWindow.value = null;
        return;
    }
    closeWindow();
};
</script>

<template>
    <div @click="closeWindowOnWrapper" :class="{'closed': !isRouletteWindowOpened}" class="roulette-screen">
        <div class="skip-scroll" v-if="!isRegistered || winId">
            <!-- <span>Нажми, чтобы ускорить</span> -->
            <span>Click to speed up</span>
            <img src="@/assets/svg/arrow2.svg" alt="" class="arrow">
        </div>
        <div :class="currentUserAction" class="roulette-window">
            <div v-if="currentUserAction !== 'getRunes' && showAwardIndicator" :class="{'value-rare': isRareValue, 'closed': !removeClosedIndicator}" class="gotten-value">
                <img src="@/assets/img/light.png" alt="" class="light">
                <div class="inner-container">
                    <strong class="title">{{gottenValue}}</strong>
                </div>
            </div>
            <div v-if="currentUserAction === 'getRunes' && showAwardIndicator" :class="{'closed': !removeClosedIndicator}" class="gotten-value gotten-value-rune">
                <div class="inner-container">
                    <img v-if="rouletteGottenValue.finalResult" :src="'/runes/' + rouletteGottenValue.finalResult + '.png'" alt="" class="rune-image">
                    <strong class="title">{{gottenValue}}</strong>
                    <p class="description">{{runeDescription}}</p>
                </div>
            </div>
            <Roulette />
        </div>
    </div>
</template>

<style lang="scss" scoped>

.skip {
    transition: none !important;
}

.roulette-screen.closed {

    .light {
        animation: none !important;
    }
}

.roulette-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
    width: 100%;
    height: var(--app-height);
    background: linear-gradient(180deg, rgba(10, 11, 35, 0.95) 0%, rgba(0, 0, 0, 0.95) 100%);
    transition: all .4s;

    .skip-scroll {
        @include flex-center;
        position: absolute;
        top: 2.2rem;
        left: 50%;
        transform: translateX(-50%);

        span {
            white-space: nowrap;
        }

        .arrow {
            width: .75rem;
            margin-left: 1.2rem;
            margin-bottom: -4px;
        }
    }

    .roulette-window {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        @media only screen and (min-width: 850px) and (max-width: 1000px) {
            top: -3rem;
        }
    }

    .roulette-window.getFreeSpins {

        .gotten-value {

            .title {
                font-size: 4.8rem !important;
            }
        }
    }
    
    .gotten-value {
        position: absolute;
        bottom: 65vh;
        left: 50%;
        transform: translateX(-50%);
        width: 32rem;
        height: 10rem;
        transition: all .6s;
        filter: drop-shadow(0px 0px 20px #3B6350);

        @media only screen and (max-width: 850px) and (max-height: 750px) {
            bottom: 70vh;
        }

        @media only screen and (max-width: 850px) and (max-height: 650px) {
            bottom: 77vh;
        }

        @media only screen and (min-width: 850px) {
            bottom: 68vh;
            transform: translateX(-50%) scale(.9);
        }

        .light {
            @include abs-center;
            width: 40rem;
            animation: rotation 60s linear infinite alternate;
        }

        .inner-container {
            @include flex-center;
            background-image: url(@/assets/img/rouletteAwardBackground.png);
            background-size: 100%;
            background-position: center;
            background-repeat: no-repeat;
            height: 100%;
            width: 100%;
            filter: drop-shadow(0px 0px 50px #3B6350);
        }

        .title {
            font-family: Reaver;
            font-size: 4.5rem;
        }
    }

    .gotten-value-rune {
        height: 20rem !important;
        text-align: center;

        @media only screen and (min-width: 850px) {
            bottom: 63vh;
            transform: translateX(-50%) scale(.8);
        }

        @media only screen and (max-width: 850px) and (max-height: 650px) {
            bottom: 70vh;
            transform: translateX(-50%) scale(.7);
        }

        .inner-container {
            background-image: url(@/assets/img/rouletteRuneAwardBackground.png) !important;
            flex-direction: column;
            padding: 0 4rem;
        }

        .rune-image {
            width: 5.5rem;
            margin-bottom: 1.5rem;
        }

        .title {
            @include yellowGradientText;
            text-shadow: none;
            font-size: 2.5rem;
            margin-bottom: .8rem;
        }
    }

    .value-rare {

        .title {
            @include yellowGradientText;
            text-shadow: none;
        }
    }
}

@keyframes rotation {
    0% {
        transform: translate(-50%, -50%) rotate(0);
    }
    50% {
        transform: translate(-50%, -50%) rotate(720deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(0);
    }
}
</style>
