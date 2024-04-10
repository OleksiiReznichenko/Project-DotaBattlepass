<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { gsap } from 'gsap';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useLevelsStore } from '@/stores/levels';
import { useEventsStore } from '@/stores/events';
import { useRouletteStore } from '@/stores/roulette';
import { RouletteType } from '@/services/api/roulette';
import type fightEvent from "@/interfaces/fightEvent";
import MapProgressBar from '@/components/Singular/Game/MapProgressBar.vue';
import ActionPanel from '@/components/Singular/Game/ActionPanel.vue';
import ExperienceLeft from '@/components/Singular/Game/ExperienceLeft.vue';
import HpContainer from '@/components/Singular/Game/HpContainer.vue';
import AwardsScreen from '@/components/Singular/Game/AwardsScreen.vue';
import RouletteScreen from '@/components/Singular/Game/RouletteScreen.vue';
import RotateScreen from '@/components/Singular/Game/RotateScreen.vue';
import Event from '@/components/Reusable/Game/Event.vue';
import RegistrationAwardWindow from '@/components/Singular/Game/RegistrationAwardWindow.vue';
import MyCharacter from '@/components/Reusable/Game/Sprites/MyCharacter.vue';
import CreepMelee from '@/components/Reusable/Game/Sprites/CreepMelee.vue';
import CreepRange from '@/components/Reusable/Game/Sprites/CreepRange.vue';
import type { LevelRequest } from '@/services/api/levels';

const baseStore = useBaseStore();
const { 
    currentUserAction, goToNextEvent, myCharacterPosition, 
    creepAnimationIndicator, previewClosedIndicator,
    isRouletteWindowOpened, updateProgressBarPositionIndicator
    } = storeToRefs(baseStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const eventsStore = useEventsStore();
const { fightEvents } = storeToRefs(eventsStore);

const levelsStore = useLevelsStore();
const { levels } = storeToRefs(levelsStore);
const rouletteStore = useRouletteStore();
const { roulettes, winId, answerSuccess } = storeToRefs(rouletteStore);

const whiteLocation = ref<null | HTMLElement>(null);
const whiteLayerBack = ref<null | HTMLElement>(null);
const whiteLayerForeground = ref<null | HTMLElement>(null);
const riverLayerBack = ref<null | HTMLElement>(null);
const riverLayerForeground = ref<null | HTMLElement>(null);
const redLayerBack = ref<null | HTMLElement>(null);
const redLayerForeground = ref<null | HTMLElement>(null);
const blackLayerBack = ref<null | HTMLElement>(null);
const blackLayerForeground = ref<null | HTMLElement>(null);
const mainMap = ref<null | HTMLElement>(null);
const myCharacter = ref<null | HTMLElement>(null);
const creepMelee = ref<null | HTMLElement>(null);
const creepRange = ref<null | HTMLElement>(null);
const mapProgressBar = ref<null | HTMLElement>(null);

const promptWrapper = ref<null | HTMLElement>(null);
const prompt1 = ref<null | HTMLElement>(null);
const prompt2 = ref<null | HTMLElement>(null);
const prompt3 = ref<null | HTMLElement>(null);
const prompt4 = ref<null | HTMLElement>(null);
const prompt5 = ref<null | HTMLElement>(null);
const prompt6 = ref<null | HTMLElement>(null);
const prompt7 = ref<null | HTMLElement>(null);
let screenScrollTime = ref<number>(1900);
let scrollingAnimationIndicator = ref<boolean>(false);
let stopScrollingAnimationIndicator = ref<boolean>(false);
let isCharacterOnInitialPosition = ref<boolean>(false);
let isScrollOnInitialPosition = ref<boolean>(false);
let polyfillIndex = ref<number>(0.5);
let backLayerFormulaIndex = ref<number>(18);
let foregroundLayerFormulaIndex = ref<number>(32);
let progressBarTranslate = ref<string>('');
let startingCameraPosition = ref<number>(0);

const halfWidth = ref<number>(0);
const locationScrollWidth = ref<number>(0);
const percentStep = ref<number>(0);

let prevWhiteLayerBackTranslate = ref<number>(1);
let prevWhiteLayerForegroundTranslate = ref<number>(1);

let prevRiverLayerBackTranslate = ref<number>(1);
let prevRiverLayerForegroundTranslate = ref<number>(1);

let prevRedLayerBackTranslate = ref<number>(1);
let prevRedLayerForegroundTranslate = ref<number>(1);

let prevBlackLayerBackTranslate = ref<number>(1);
let prevBlackLayerForegroundTranslate = ref<number>(1);

const currentEvent = computed<undefined | fightEvent>(() => {
    return fightEvents.value.find(el => {
        return el.userLevel === user.value.level;
    })
})

const currentLevelObject = computed<LevelRequest>(() => {
    return levels.value.find(el => {
        return el.levelId === user.value.level;
    })!
})

const prevLevelObject = computed<LevelRequest>(() => {
    return levels.value.find(el => {
        return el.levelId === user.value.level - 1;
    })!
})

const nextLevelObject = computed<LevelRequest>(() => {
    return levels.value.find(el => {
        return el.levelId === user.value.level + 1;
    })!
})

const isTouchDevice = () => {  
    return (('ontouchstart' in window) ||  
        (navigator.maxTouchPoints > 0));
};

const calcCharacterPosition = (): void => {
    if (myCharacter.value && fightEvents.value.length >= 1) {
        let currentEvent = fightEvents.value.find((el, i, arr) => {
            if (el.userLevel === user.value.level) {
                return el.userLevel === user.value.level;
            } else if (arr[i + 1]?.userLevel) {
                return el.userLevel === user.value.level || user.value.level - arr[i + 1].userLevel < 0;
            }
        });
        if (!currentEvent && user.value.level >= levels.value[levels.value.length - 1].levelId) {
            currentEvent = fightEvents.value[fightEvents.value.length - 1]
        }
        let xPercent = 0;
        if (currentEvent) {
            xPercent = currentEvent.myCharacterLeftPosition;
            if (window.outerWidth < 850 && isRegistered.value) {
                xPercent -= .4;
            }
        }

        if (user.value.level < 3 && window.outerWidth > 1600) {
            if (!isRegistered.value) {
                xPercent = 2;
            } else {
                xPercent = .5;
            }
        }
        

        const xValue = mainMap.value!.clientWidth / 100 * xPercent;
        myCharacterPosition.value = xValue;

        if (!isCharacterOnInitialPosition.value) {
            myCharacter.value.style.transition = 'none';
            isCharacterOnInitialPosition.value = true;
        } else {
            myCharacter.value.style.transition = 'all 2.5s';
        }
        myCharacter.value.style.transform = `translateX(${xValue}px)`;
    }
};

const calcScrollPosition = (): void => {
    if (!window || !document.body || !user.value || !mainMap.value?.clientWidth) return;
    let scrollPosition = 0;
    if (user.value.level < 3) {
        if (window.outerWidth > 850) {
            scrollPosition = 0;
        }

        if (window.outerWidth <= 850 && window.outerWidth > 750) {
            scrollPosition = 100;
        }

        if (window.outerWidth < 750 && window.outerWidth > 650) {
            scrollPosition = 150;
        }

        if (window.outerWidth < 650 && window.outerWidth > 550) {
            scrollPosition = 200;
        }

        if (window.outerWidth < 550 && window.outerWidth > 450) {
            scrollPosition = 250;
        }

        if (window.outerWidth < 500) {
            scrollPosition = 250;

            if (window.outerHeight < 650) {
                scrollPosition = 220;
            }

            if (window.outerHeight < 600) {
                scrollPosition = 200;
            }

            if (window.outerHeight < 550) {
                scrollPosition = 160;
            }

            if (window.outerHeight > 770) {
                scrollPosition = 270;
            }

            if (window.outerHeight > 820) {
                scrollPosition = 280;
            }
        }

        startingCameraPosition.value = scrollPosition;
    } else {
        let currentEventPosition = fightEvents.value.find(el => {
            if (currentUserAction.value !== 'go') {
                return el.userLevel === user.value.level;
            } else {
                return el.userLevel === user.value.level;
            }
        })?.myCharacterLeftPosition;

        if (currentEventPosition !== 0 && !currentEventPosition) {
            currentEventPosition = fightEvents.value.find(el => {
                if (currentUserAction.value !== 'go') {
                    return el.userLevel === user.value.level - 1;
                } else {
                    return el.userLevel === user.value.level;
                }
            })?.myCharacterLeftPosition;
        }

        if (!currentEventPosition || !mainMap.value) return;
        if (isRegistered.value) {
            if (window.outerWidth > 850) {
                scrollPosition = (currentEventPosition - 3) / 100 * (mainMap.value.clientWidth);
            } else if (window.outerWidth <= 850 && window.outerWidth > 600) {
                scrollPosition = (currentEventPosition + 1) / 100 * (mainMap.value.clientWidth);
            } else if (window.outerWidth <= 600) {
                scrollPosition = (currentEventPosition + 2) / 100 * (mainMap.value.clientWidth);
                // if (window.outerHeight < 650) {
                //     scrollPosition = (currentEventPosition + 1.5) / 100 * (mainMap.value.clientWidth);
                // }
            }
        } else {
            if (window.outerWidth > 850) {
                scrollPosition = (currentEventPosition - 10) / 100 * (mainMap.value.clientWidth);
            } else if (window.outerWidth <= 850 && window.outerWidth > 600) {
                scrollPosition = (currentEventPosition + 6) / 100 * (mainMap.value.clientWidth);
            } else if (window.outerWidth <= 600) {
                scrollPosition = (currentEventPosition + 10) / 100 * (mainMap.value.clientWidth);
            }
        }

        if (!isScrollOnInitialPosition.value) {
            document.body.scrollLeft = scrollPosition - 100;
        }
    }
    let oneStep = (scrollPosition - document.body.scrollLeft) / Math.floor(screenScrollTime.value / 16);

    if (!isScrollOnInitialPosition.value) {
        document.body.scrollLeft = scrollPosition - 100;
        isScrollOnInitialPosition.value = true;
        oneStep = (scrollPosition - document.body.scrollLeft) / Math.floor(500 / 16);
    }

    let animationFrame: any = null;
    function callback() {
        if (document.body.scrollLeft >= scrollPosition && oneStep >= 0 ||
        document.body.scrollLeft <= scrollPosition && oneStep <= 0 || mainMap.value && Math.round(document.body.scrollLeft + window.outerWidth) >= mainMap.value.clientWidth * 0.97 ||
        stopScrollingAnimationIndicator.value) {
            scrollingAnimationIndicator.value = false;
            stopScrollingAnimationIndicator.value = false;
            cancelAnimationFrame(animationFrame);
            return;
        }
        scrollingAnimationIndicator.value = true;
        document.body.scrollLeft += oneStep;
        animationFrame = requestAnimationFrame(callback)
    }
    animationFrame = requestAnimationFrame(callback);
}

let finishedAnimationIndicator = ref<boolean>(true);

const goToEvent = (event: Event): void => {
    if (!finishedAnimationIndicator.value) return;
    const target = event.target as HTMLElement;

    const eventCircle = target.closest('.event-circle') as HTMLElement;
    if (!eventCircle) return;
    let currentEventPosition = 0, currentEventIndex: number;
    if (!eventCircle.classList.contains('my-character')) {
        const id = eventCircle.dataset.id!;
        const currentEvent = fightEvents.value.find(el => {
            return el.id === +id;
        })!;
        currentEventIndex = fightEvents.value.findIndex(el => {
            return el.id === +id;
        });
        currentEventPosition = currentEvent.myCharacterLeftPosition;
    } else {
        const currentEvent = fightEvents.value.find((el, i, arr) => {
            return el.userLevel === user.value.level || user.value.level - arr[i + 1].userLevel < 0;
        })!;
        currentEventPosition = currentEvent.myCharacterLeftPosition;
        currentEventIndex = fightEvents.value.findIndex(el => {
            return el.id === +currentEvent.id;
        });
    }

    if (!currentEventPosition && currentEventPosition !== 0 || !mainMap.value) return;
    finishedAnimationIndicator.value = false;
    let scrollPosition = 0;
    if (isRegistered.value) {
        if (window.outerWidth > 850) {
            scrollPosition = (currentEventPosition - 2.5) / 100 * (mainMap.value.clientWidth);
        } else if (window.outerWidth <= 850 && window.outerWidth > 600) {
            scrollPosition = (currentEventPosition + 1) / 100 * (mainMap.value.clientWidth);
        } else if (window.outerWidth <= 600) {
            scrollPosition = (currentEventPosition + 2) / 100 * (mainMap.value.clientWidth);
        }
    } else {
        if (window.outerWidth > 850) {
            scrollPosition = (currentEventPosition - 10) / 100 * (mainMap.value.clientWidth);
        } else if (window.outerWidth <= 850 && window.outerWidth > 600) {
            scrollPosition = (currentEventPosition + 6) / 100 * (mainMap.value.clientWidth);
        } else if (window.outerWidth <= 600) {
            scrollPosition = (currentEventPosition + 10) / 100 * (mainMap.value.clientWidth);
        }
    }
    const oneStep = (scrollPosition - document.body.scrollLeft) / Math.floor(screenScrollTime.value / 16);
    function callback() {
        if (document.body.scrollLeft >= scrollPosition && oneStep > 0 ||
        document.body.scrollLeft <= scrollPosition && oneStep < 0 || Math.round(document.body.scrollLeft + window.outerWidth) >= mainMap.value!.clientWidth && (currentEventIndex + 1 === fightEvents.value.length)
        || document.body.scrollLeft <= 0 && (currentEventIndex === 0) || stopScrollingAnimationIndicator.value) {
            finishedAnimationIndicator.value = true;
            scrollingAnimationIndicator.value = false;
            stopScrollingAnimationIndicator.value = false;
            return;
        }
        scrollingAnimationIndicator.value = true;
        document.body.scrollLeft += oneStep;
        requestAnimationFrame(callback)
    }
    requestAnimationFrame(callback);
};


const calcParallaxPosition = (): void => {
    if (window.outerWidth < 1400 && mainMap.value && mapProgressBar.value) {
        if (document.body.scrollLeft < startingCameraPosition.value + 20) return;
        const progressBarWidth = 1370;
        const progreeBarNeededScroll = progressBarWidth - window.outerWidth;
        const scrollPercent = (mainMap.value.clientWidth - window.outerHeight) / 100;
        const movePercent = progreeBarNeededScroll / 100;

        const move = (document.body.scrollLeft - startingCameraPosition.value) / scrollPercent * movePercent;

        if (move > progressBarWidth) return;

        progressBarTranslate.value = `translateX(-${move}px)`;
    }


    const percentWhiteLocation = Math.floor(document.body.scrollLeft / percentStep.value) / 100;

    const whiteLayerBackFormula = percentStep.value * backLayerFormulaIndex.value * percentWhiteLocation;
    const whiteLayerBackTranslateValue = gsap.utils.interpolate(prevWhiteLayerBackTranslate.value, whiteLayerBackFormula, polyfillIndex.value);

    const whiteLayerForegroundFormula = percentStep.value * foregroundLayerFormulaIndex.value * percentWhiteLocation;
    const whiteLayerForegroundTranslateValue = gsap.utils.interpolate(prevWhiteLayerForegroundTranslate.value, whiteLayerForegroundFormula, polyfillIndex.value);

    requestAnimationFrame(() => {
        if (!whiteLayerBack.value || !whiteLayerForeground.value) return;
        whiteLayerBack.value.style.transform = `translateX(${whiteLayerBackTranslateValue}px)`;
        whiteLayerForeground.value.style.transform = `translateX(-${whiteLayerForegroundTranslateValue}px)`;
    })
    
    prevWhiteLayerBackTranslate.value = whiteLayerBackTranslateValue;
    prevWhiteLayerForegroundTranslate.value = whiteLayerForegroundTranslateValue;

    if (!isRegistered.value) return;

    
    const percentRiverLocation = Math.floor((document.body.scrollLeft - locationScrollWidth.value - 0.75 * halfWidth.value) / percentStep.value) / 100;

    if (percentRiverLocation >= 0 && percentRiverLocation <= 100) {
        const riverLayerBackFormula = percentStep.value * backLayerFormulaIndex.value * percentRiverLocation;
        const riverLayerBackTranslateValue = gsap.utils.interpolate(prevRiverLayerBackTranslate.value, riverLayerBackFormula, polyfillIndex.value);

        const riverLayerForegroundFormula = percentStep.value * foregroundLayerFormulaIndex.value * percentRiverLocation;
        const riverLayerForegroundTranslateValue = gsap.utils.interpolate(prevRiverLayerForegroundTranslate.value, riverLayerForegroundFormula, polyfillIndex.value);

        requestAnimationFrame(() => {
            if (!riverLayerBack.value || !riverLayerForeground.value) return;
            riverLayerBack.value.style.transform = `translateX(${riverLayerBackTranslateValue}px)`;
            riverLayerForeground.value.style.transform = `translateX(-${riverLayerForegroundTranslateValue}px)`;
        })
        
        prevRiverLayerBackTranslate.value = riverLayerBackTranslateValue;
        prevRiverLayerForegroundTranslate.value = riverLayerForegroundTranslateValue;
    }

    
    const percentRedLocation = Math.floor((document.body.scrollLeft - 2 * locationScrollWidth.value - 2.25 * halfWidth.value) / percentStep.value) / 100;

    if (percentRedLocation >= 0 && percentRedLocation <= 100) {
        const redLayerBackFormula = percentStep.value * backLayerFormulaIndex.value * percentRedLocation;
        const redLayerBackTranslateValue = gsap.utils.interpolate(prevRedLayerBackTranslate.value, redLayerBackFormula, polyfillIndex.value);

        const redLayerForegroundFormula = percentStep.value * foregroundLayerFormulaIndex.value * percentRedLocation;
        const redLayerForegroundTranslateValue = gsap.utils.interpolate(prevRedLayerForegroundTranslate.value, redLayerForegroundFormula, polyfillIndex.value);

        requestAnimationFrame(() => {
            if (!redLayerBack.value || !redLayerForeground.value) return;
            redLayerBack.value.style.transform = `translateX(${redLayerBackTranslateValue}px)`;
            redLayerForeground.value.style.transform = `translateX(-${redLayerForegroundTranslateValue}px)`;
        })
        
        prevRedLayerBackTranslate.value = redLayerBackTranslateValue;
        prevRedLayerForegroundTranslate.value = redLayerForegroundTranslateValue;
    }

    
    const percentBlackLocation = Math.floor((document.body.scrollLeft - 3 * locationScrollWidth.value - 4 * halfWidth.value) / percentStep.value) / 100;

    if (percentBlackLocation >= 0 && percentBlackLocation <= 100) {
        const blackLayerBackFormula = percentStep.value * backLayerFormulaIndex.value * percentBlackLocation;
        const blackLayerBackTranslateValue = gsap.utils.interpolate(prevBlackLayerBackTranslate.value, blackLayerBackFormula, polyfillIndex.value);

        const blackLayerForegroundFormula = percentStep.value * foregroundLayerFormulaIndex.value * percentBlackLocation;
        const blackLayerForegroundTranslateValue = gsap.utils.interpolate(prevBlackLayerForegroundTranslate.value, blackLayerForegroundFormula, polyfillIndex.value);

        requestAnimationFrame(() => {
            if (!blackLayerBack.value || !blackLayerForeground.value) return;
            blackLayerBack.value.style.transform = `translateX(${blackLayerBackTranslateValue}px)`;
            blackLayerForeground.value.style.transform = `translateX(-${blackLayerForegroundTranslateValue}px)`;
        })

        prevBlackLayerBackTranslate.value = blackLayerBackTranslateValue;
        prevBlackLayerForegroundTranslate.value = blackLayerForegroundTranslateValue;
    }
};

watchEffect(() => {
    if (myCharacter.value && goToNextEvent.value) {
        calcCharacterPosition();
        calcScrollPosition();
        goToNextEvent.value = false;
        setTimeout(() => {
            checkUserAction(true);
            updateProgressBarPositionIndicator.value = true;
        }, 2700);
    }
});

let opacityTimeout = ref<any>(null);
watchEffect(() => {
    if (!creepMelee.value || !creepRange.value || !fightEvents.value) return;
    if (creepAnimationIndicator.value) {
        const currentEvent = fightEvents.value.find((el, i, arr) => {
            if (currentUserAction.value === 'go') {
                if (el.userLevel === user.value.level - 1) {
                    return el;
                } else if (arr[i + 2]?.userLevel) {
                    return el.userLevel === user.value.level || user.value.level - arr[i + 2].userLevel < 0;
                }
            }
            if (el.userLevel === user.value.level) {
                return el;
            } else if (arr[i + 1]?.userLevel) {
                return el.userLevel === user.value.level || user.value.level - arr[i + 1].userLevel < 0;
            }
        })!;
        let position = mainMap.value!.clientWidth / 100 * (currentEvent.myCharacterLeftPosition + 3) + window.outerWidth;
        if (!isRegistered.value) {
            position = mainMap.value!.clientWidth / 100 * (currentEvent.myCharacterLeftPosition + 11) + window.outerWidth;
        }
        creepMelee.value.style.transition = 'none';
        creepMelee.value.style.transform = `translateX(${position}px)`;

        creepRange.value.style.transition = 'none';
        creepRange.value.style.transform = `translateX(${position}px)`;
        if (currentUserAction.value !== 'go') {
            calcScrollPosition();
        }
        setTimeout(() => {
            creepMelee.value!.style.transition = 'transform 1s, opacity .3s';
            creepMelee.value!.style.opacity = '1';
            creepMelee.value!.style.transform = `translateX(${position - window.outerWidth}px)`;
            
            creepRange.value!.style.transition = 'transform 1s, opacity .3s';
            creepRange.value!.style.opacity = '1';
            creepRange.value!.style.transform = `translateX(${position - window.outerWidth * .9}px)`;
            opacityTimeout.value = setTimeout(() => {
                creepAnimationIndicator.value = false;
                creepMelee.value!.style.opacity = '0';
                creepRange.value!.style.opacity = '0';
                opacityTimeout.value = null;
            }, 3500);
        }, 500);
    } else {
        creepMelee.value.style.transition = 'none';
        creepRange.value.style.transition = 'none';
        creepMelee.value!.style.opacity = '0';
        creepRange.value!.style.opacity = '0';
        opacityTimeout.value = null;
    }
})

watchEffect(() => {
    if ((isRegistered.value && levels.value.length >= 1 || previewClosedIndicator.value) && myCharacter.value && currentUserAction.value !== 'go') {
        previewClosedIndicator.value = false;
        setTimeout(() => {
            calcCharacterPosition();
            calcScrollPosition();
        }, 2000);
    }
})

const attackFarmSpins = ref<undefined | number>(0);
const freeSpinsSpins = ref<undefined | number>(0);
const runesSpins = ref<undefined | number>(0);

watchEffect(() => {
    if (!roulettes.value || roulettes.value.length < 1) return;
    attackFarmSpins.value = roulettes.value.find(el => {
        return el.name === RouletteType.FARM;
    })?.state.spins;

    runesSpins.value = roulettes.value.find(el => {
        return el.name === RouletteType.RUNIC;
    })?.state.spins;

    freeSpinsSpins.value = roulettes.value.find(el => {
        return el.name === RouletteType.MINE;
    })?.state.spins;
})

const checkUserAction = (onRegister: boolean): void => {
    if (!currentEvent.value) {
        if (!onRegister && currentUserAction.value !== 'go') {
            currentUserAction.value = 'farm';
        } else if (onRegister) {
            currentUserAction.value = 'farm';
        }
    }

    if (currentEvent.value) {
        if (!onRegister && currentUserAction.value !== 'go') {
            currentUserAction.value = currentEvent.value.userActionType;
        } else if (onRegister) {
            currentUserAction.value = currentEvent.value.userActionType;
        }
    }

    if (isRegistered.value) {
        rouletteStore.getRoullettes();
        if (currentUserAction.value === 'getFreeSpins' && (currentEvent.value?.rouletteTaken || (!freeSpinsSpins.value || freeSpinsSpins.value < 1)) || 
        currentUserAction.value === 'getRunes' && (currentEvent.value?.rouletteTaken || (!runesSpins.value || runesSpins.value < 1))) {
            currentUserAction.value = 'farm';
        }
        
        if (currentEvent.value?.rouletteTaken) return;

        if (currentEvent.value?.userActionType === 'getFreeSpins' && (freeSpinsSpins.value && freeSpinsSpins.value >= 1)) {
            currentUserAction.value = 'getFreeSpins';
        }

        if (currentEvent.value?.userActionType === 'getRunes' && (runesSpins.value && runesSpins.value >= 1)) {
            currentUserAction.value = 'getRunes';
        }
    }
}

watchEffect(() => {
    if (currentUserAction.value === 'go') {
        promptWrapper.value?.classList.add('closed');
        return;
    }

    if (!isRegistered.value) {
        if (user.value.level === 1 && currentUserAction.value === 'getFreeSpins') {
            promptWrapper.value?.classList.remove('closed');
            prompt1.value?.classList.remove('closed')
        } else {
            prompt1.value?.classList.add('closed');
        }
        if (user.value.level === 2 || user.value.level === 1 && currentUserAction.value === 'farm') {
            promptWrapper.value?.classList.remove('closed');
            prompt2.value?.classList.remove('closed');
        } else {
            prompt2.value?.classList.add('closed');
        }
        if (user.value.level === 3) {
            promptWrapper.value?.classList.remove('closed');
            prompt4.value?.classList.remove('closed');
        } else {
            prompt4.value?.classList.add('closed');
        }
        if (user.value.level === 4) {
            promptWrapper.value?.classList.remove('closed');
            prompt5.value?.classList.remove('closed');
        } else {
            prompt5.value?.classList.add('closed');
        }
    } else {
        promptWrapper.value?.classList.add('closed');
        if (user.value.level === 1 && currentUserAction.value === 'getFreeSpins' && (currentLevelObject.value && user.value.points - currentLevelObject.value.points <= 150) && freeSpinsSpins.value) {
            promptWrapper.value?.classList.remove('closed');
            prompt1.value?.classList.remove('closed')
        } else {
            prompt1.value?.classList.add('closed');
        }

        if (user.value.level === 1 && currentUserAction.value === 'farm' && (currentLevelObject.value && user.value.points - currentLevelObject.value.points <= 150) && attackFarmSpins.value) {
            promptWrapper.value?.classList.remove('closed');
            prompt2.value?.classList.remove('closed');
        } else {
            prompt2.value?.classList.add('closed');
        }

        if (user.value.level === 3 && (currentLevelObject.value && user.value.points - currentLevelObject.value.points <= 150) && runesSpins.value) {
            promptWrapper.value?.classList.remove('closed');
            prompt4.value?.classList.remove('closed');
        } else {
            prompt4.value?.classList.add('closed');
        }
        
        if (user.value.level === 13 && (currentLevelObject.value && user.value.points - currentLevelObject.value.points <= 150) && attackFarmSpins.value) {
            promptWrapper.value?.classList.remove('closed');
            prompt6.value?.classList.remove('closed');
        } else {
            prompt6.value?.classList.add('closed');
        }
        
        if (user.value.level === 24 && (currentLevelObject.value && user.value.points - currentLevelObject.value.points <= 150) && attackFarmSpins.value) {
            promptWrapper.value?.classList.remove('closed');
            prompt7.value?.classList.remove('closed');
        } else {
            prompt7.value?.classList.add('closed');
        }
    }
})

watch(currentEvent, (newValue) => {
    checkUserAction(false);
})

watch(isRegistered, (newValue) => {
    if (newValue) {
        setTimeout(() => {
            checkUserAction(true);
            calcCharacterPosition();
            calcScrollPosition();
            goToNextEvent.value = false;
        }, 5000);
    }
})
// const freeSpinsSpins = computed(() => {
//     let spins = roulettes.value.find(el => {
//         return el.name === RouletteType.MINE;
//     })?.state.spins;
//     if (!spins) {
//         spins = 0;
//     }
//     return spins;
// });

// const runesSpins = computed(() => {
//     let spins = roulettes.value.find(el => {
//         return el.name === RouletteType.RUNIC;
//     })?.state.spins;
//     if (!spins) {
//         spins = 0;
//     }
//     return spins;
// });

watchEffect(() => {
    if (!isRegistered.value || isRouletteWindowOpened.value) return;
    setTimeout(() => {
        if (currentUserAction.value === 'getFreeSpins' && (currentEvent.value?.rouletteTaken || (!freeSpinsSpins.value || freeSpinsSpins.value < 1)) || 
        currentUserAction.value === 'getRunes' && (currentEvent.value?.rouletteTaken || (!runesSpins.value || runesSpins.value < 1))) {
            currentUserAction.value = 'farm';
        }
        
        if (currentEvent.value?.rouletteTaken) return;

        if (currentEvent.value?.userActionType === 'getFreeSpins' && (freeSpinsSpins.value && freeSpinsSpins.value >= 1)) {
            currentUserAction.value = 'getFreeSpins';
        }

        if (currentEvent.value?.userActionType === 'getRunes' && (runesSpins.value && runesSpins.value >= 1)) {
            currentUserAction.value = 'getRunes';
        }
    }, 300);
})

onMounted(() => {
    if (window.outerWidth < 850) {
        screenScrollTime.value = 1400;
    }

    if (levels.value.length >= 1) {
        calcCharacterPosition();
        calcScrollPosition();
    }

    checkUserAction(false);


    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    document.body.addEventListener('mousedown', (event: MouseEvent) => {
        isDown = true;
        document.body.classList.add('body-grabbing');
        startX = event.pageX - document.body.offsetLeft;
        scrollLeft = document.body.scrollLeft;
    });

    document.body.addEventListener('mouseleave', () => {
        isDown = false;
        document.body.classList.remove('body-grabbing');
    });

    document.body.addEventListener('mouseup', () => {
        isDown = false;
        document.body.classList.remove('body-grabbing');
    });

    document.body.addEventListener('mousemove', (event: MouseEvent) => {
        if(!isDown) return;
        event.preventDefault();
        const x = event.pageX - document.body.offsetLeft;
        const walk = (x - startX) * 1.25;
        document.body.scrollLeft = scrollLeft - walk;

        if (scrollingAnimationIndicator.value) {
            stopScrollingAnimationIndicator.value = true;
        }
    });

    document.body.addEventListener('touchmove', () => {
        if (scrollingAnimationIndicator.value) {
            stopScrollingAnimationIndicator.value = true;
        }
    })

    if (isTouchDevice()) {
        polyfillIndex.value = 0.15;
        backLayerFormulaIndex.value = 9;
        foregroundLayerFormulaIndex.value = 20;
    }

    halfWidth.value = window.outerWidth / 2;
    locationScrollWidth.value = whiteLocation.value!.clientWidth - window.outerWidth;
    percentStep.value = (locationScrollWidth.value) / 100;

    document.body.addEventListener('wheel', (event: WheelEvent) => {
        if (scrollingAnimationIndicator.value) {
            stopScrollingAnimationIndicator.value = true;
        }
        document.body.scrollLeft = gsap.utils.interpolate(document.body.scrollLeft, document.body.scrollLeft + event.deltaY + event.deltaX, .65); 
    });

    document.body.addEventListener('scroll', calcParallaxPosition);
})
</script>

<template>
    <div ref="gamePage" :class="{'no-login': !isRegistered}" class="game-page">
        <RotateScreen />
        <RouletteScreen />
        <AwardsScreen />
        <RegistrationAwardWindow v-if="!isRegistered" />

        <div ref="promptWrapper" class="prompts-wrapper">
            <div ref="prompt1" class="closed prompt prompt-1">
                <img src="/prompts/prompt1.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Добро пожаловать в <strong>DOTA BOOM</strong>! Нажми <strong>«Получить»</strong>, чтобы начать играть. -->
                    Welcome to <strong>DOTA BOOM</strong>! Click <strong>Get</strong>, to start playing.
                </p>
            </div>

            <div ref="prompt2" class="closed prompt prompt-2">
                <img src="/prompts/prompt2.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>фарм</strong>. Получай <strong>опыт</strong>, чтобы перейти на следующий уровень. -->
                    This is <strong>farm</strong>. Get <strong>XP</strong>, to go to the next level.
                </p>
            </div>

            <div ref="prompt3" class="closed prompt prompt-3">
                <img src="/prompts/prompt3.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>дружеская башня</strong>. Она дает бесплатные <strong>ходы</strong>. -->
                    This is <strong>friendly tower</strong>. It gives you free <strong>moves</strong>.
                </p>
            </div>

            <div ref="prompt4" class="closed prompt prompt-4">
                <img src="/prompts/prompt4.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>руна</strong>. Она дает <strong>бонусы</strong>. -->
                    This is <strong>rune</strong>. It gives you <strong>bonuses</strong>.
                </p>
            </div>

            <div ref="prompt5" class="closed prompt prompt-5">
                <img src="/prompts/prompt5.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>вражеский герой</strong>. Срази его и получи <strong>награду</strong>. -->
                    This is <strong>enemy hero</strong>. Fight him and get a <strong>reward</strong>.
                </p>
            </div>

            <div ref="prompt6" class="closed prompt prompt-6">
                <img src="/prompts/prompt6.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>вражеская башня</strong>. Уничтожь её и получи <strong>награду</strong>. -->
                    This is <strong>enemy tower</strong>. Destroy it to get a <strong>reward</strong>.
                </p>
            </div>

            <div ref="prompt7" class="closed prompt prompt-7">
                <img src="/prompts/prompt7.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Ты добрался до <strong>Трона</strong>! Уничтожь его, чтобы пройти <strong>игру</strong>. -->
                    Have you reached the <strong>Throne</strong>! Destroy to finish the <strong>game</strong>.
                </p>
            </div>
        </div>
        
        <div class="inner-container">
            <HpContainer v-if="currentEvent?.hp && currentUserAction !== 'go'"
                :currentEvent="currentEvent"
                :currentLevel="currentLevelObject"
                :prevLevel="prevLevelObject"
                :nextLevel="nextLevelObject"
                :userXp="user.points"
            />
            <ExperienceLeft :class="{'closed': currentUserAction !== 'farm' && currentUserAction !== 'go' }" />
            <div ref="mainMap" class="main-map">
                <div ref="myCharacter" class="my-character">
                    <MyCharacter />
                </div>
                <div ref="creepMelee" class="creep-melee">
                    <CreepMelee />
                </div>
                <div ref="creepRange" class="creep-range">
                    <CreepRange />
                </div>
                <Event 
                    v-for="(fightEvent, index) in fightEvents"
                    :key="fightEvent.id"
                    :index="index + 1"
                    :name="fightEvent.name"
                    :icon="fightEvent.icon"
                    :eventLeftPosition="fightEvent.myCharacterLeftPosition"
                    :userLevel="fightEvent.userLevel"
                    :awards="fightEvent.awards"
                    :sprites="fightEvent.sprites"
                />
                <div ref="whiteLocation" class="location white-location">
                    <div ref="whiteLayerBack" class="layer base-layer"></div>
                    <div class="layer front-layer"></div>
                    <div class="layer sky-layer"></div>
                </div>
                <div class="foreground-layer-container white-location__foreground-layer-container">
                    <img ref="whiteLayerForeground" src="@/assets/img/map/1.Radiant/Foreground.png" class="layer foreground-layer">
                </div>
                <img v-if="isRegistered" src="@/assets/img/map/1.Divider.png" alt="" class="divider divider-1">
                <div v-if="isRegistered" class="location river-location">
                    <div ref="riverLayerBack" class="layer base-layer"></div>
                    <div class="layer front-layer"></div>
                </div>
                <div v-if="isRegistered" class="foreground-layer-container river-location__foreground-layer-container">
                    <img ref="riverLayerForeground" src="@/assets/img/map/2.River/Foreground.png" class="layer foreground-layer">
                </div>
                <img v-if="isRegistered" src="@/assets/img/map/2.Divider.png" alt="" class="divider divider-2">
                <div v-if="isRegistered" class="location red-location">
                    <div ref="redLayerBack" class="layer base-layer"></div>
                    <div class="layer front-layer"></div>
                </div>
                <div v-if="isRegistered" class="foreground-layer-container red-location__foreground-layer-container">
                    <img ref="redLayerForeground" src="@/assets/img/map/3.Dire/Foreground.png" class="layer foreground-layer">
                </div>
                <img v-if="isRegistered" src="@/assets/img/map/3.Divider.png" alt="" class="divider divider-3">
                <div v-if="isRegistered" class="location black-location">
                    <div ref="blackLayerBack" class="layer base-layer"></div>
                    <div class="layer front-layer"></div>
                </div>
                <div v-if="isRegistered" class="foreground-layer-container black-location__foreground-layer-container">
                    <img ref="blackLayerForeground" src="@/assets/img/map/4.DireTop/Foreground.png" class="layer foreground-layer">
                </div>
            </div>
            <div class="bottom-panel">
                <ActionPanel />
                <MapProgressBar :style="{'transform': progressBarTranslate}" ref="mapProgressBar" @click="goToEvent" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.game-page.no-login {
    width: 400vh !important;

    .my-character {
        left: 4% !important;

        @media only screen and (min-width: 850px) {
            left: 2% !important;
        }

        @media only screen and (min-width: 1600px) {
            left: 0% !important;
        }
    }

    .white-location,
    .white-location__foreground-layer-container {
        left: 0;

        .base-layer {
            left: -4% !important;
        }
    }
}

.game-page {
    height: var(--app-height);
    width: 1600vh;
    overflow-y: hidden;

    .bottom-panel {
        position: fixed;
        bottom: 4.65rem;
        left: 0;
        width: 100%;
        z-index: 5000;

        @media only screen and (min-width: 850px) {
            bottom: 0;
        }
    }

    .prompts-wrapper {
        position: fixed;
        top: 0;
        left: 0;
        transition: all .2s;
        width: 100%;
        height: 14rem;
        z-index: 50000;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.504) 48.68%, rgba(47, 52, 56, 0) 100%);
    
        .prompt {
            @include abs-center;
            @include textureBackground;
            @include flex-center;
            top: 25%;
            justify-content: flex-end;
            transform: translateX(-50%);
            width: 34rem;
            height: 6.4rem;
            z-index: 100000;
            padding: .6rem;
            transition: all .2s;
            border-top-left-radius: 20px;;
            border-bottom-left-radius: 20px;;

            @media only screen and (min-width: 850px) {
                top: 2rem;
                width: 35rem;
                height: 5.6rem;
            }

            &__image {
                position: absolute;
                top: -.8rem;
                left: -1.2rem;
                width: 8rem;
                height: 8rem;
                margin-right: .8rem;
            }

            &__description {
                font-size: 1.4rem;
                width: 26rem;

                @media only screen and (min-width: 850px) {
                    width: 26.5rem;
                    font-size: 16px;
                }
            }
        }
    }

    .main-map {
        height: var(--app-height);
        position: relative;
        width: 100%;
        overflow: hidden;
        transition: all .2s;

        .my-character {
            position: absolute;
            bottom: 28vh;
            z-index: 400;
            left: 1%;
            height: 70vh;
            width: 700px;

            @media only screen and (min-width: 850px) {
                height: 80vh;
                left: .5%;
                bottom: 21vh;
            }

            @media only screen and (min-width: 1600px) {
                left: 0%;
            }
        }

        .creep-melee,
        .creep-range {
            position: absolute;
            bottom: 23vh;
            left: 0%;
            z-index: 2000;
            height: 70vh;
            width: 30rem;

            @media only screen and (min-width: 850px) {
                bottom: 20vh;
            }
        }

        .layer {
            position: absolute;
            height: 100%;
            width: 100%;
            background-size: cover;
        }

        .divider {
            height: var(--app-height);
            position: absolute;
            top: 0;
            z-index: 2500;
            filter: blur(4px);
        }

        .divider-1 {
            height: 105vh;
            top: -2vh;
            left: 760vh;
            left: 370vh;
        }

        .divider-2 {
            height: 105vh;
            top: -2vh;
            left: 760vh;
        }

        .divider-3 {
            left: 1130vh;
        }

        .location,
        .foreground-layer-container {
            height: var(--app-height);
            width: 400vh;
            position: absolute;
            top: 0;
            overflow: hidden;

            .base-layer {
                width: 102%;
                top: -1%;
                left: 0;
                z-index: 10;
                will-change: transform;

                @media only screen and (max-width: 850px) {
                    top: -5% !important;
                }
            }

            .front-layer {
                top: 0;
                left: 0;
                z-index: 100;

                @media only screen and (max-width: 850px) {
                    top: -11% !important;
                }
            }

            .foreground-layer {
                height: auto;
                width: 85%;
                bottom: 0;
                left: 0;
                z-index: 2500;
                filter: blur(4px);
                will-change: transform;
            }
        }

        .foreground-layer-container {
            z-index: 2400 !important;
        }

        .white-location,
        .white-location__foreground-layer-container {
            left: 0;

            .base-layer {
                width: 103%;
                left: -5%;
                background-image: url(@/assets/img/map/1.Radiant/Back.png);

                @media only screen and (max-width: 850px) {
                    background-image: url(@/assets/img/map/1.Radiant/Back.mobile.png);
                }
            }

            .front-layer {
                width: 106%;
                top: -5%;
                left: -6%;
                background-image: url(@/assets/img/map/1.Radiant/Front.png);

                @media only screen and (max-width: 850px) {
                    background-image: url(@/assets/img/map/1.Radiant/Front.mobile.png);
                }
            }

            .sky-layer {
                top: 0;
                left: 0;
                background-image: url(@/assets/svg/whiteMapLayerSky.svg);
                z-index: 300;
            }

            .foreground-layer {
                bottom: -2%;
                left: 2%;
                height: auto;
                width: 75%;
            }
        }

        .river-location,
        .river-location__foreground-layer-container {
            left: 400vh;
            z-index: 100;

            .base-layer {
                left: -8%;
                background-image: url(@/assets/img/map/2.River/Back.png);

                @media only screen and (max-width: 850px) {
                    background-image: url(@/assets/img/map/2.River/Back.mobile.png);
                }
            }

            .front-layer {
                background-image: url(@/assets/img/map/2.River/Front.png);
            }

            .foreground-layer {
                left: 20%;
                width: 75%;

            }
        }

        .red-location,
        .red-location__foreground-layer-container {
            left: 800vh;
            z-index: 200;

            .base-layer {
                top: 0 !important;
                left: -10%;
                background-image: url(@/assets/img/map/3.Dire/Back.png);

                @media only screen and (max-width: 850px) {
                    background-image: url(@/assets/img/map/3.Dire/Back.mobile.png);
                }
            }

            .front-layer {
                background-image: url(@/assets/img/map/3.Dire/Front.png);

                @media only screen and (max-width: 850px) {
                    background-image: url(@/assets/img/map/3.Dire/Front.mobile.png);
                }
            }

            .foreground-layer {
                left: 25%;
                width: 70%;

            }
        }

        .black-location,
        .black-location__foreground-layer-container {
            left: 1200vh;
            z-index: 300;

            .base-layer {
                left: -15%;
                background-image: url('@/assets/img/map/4.DireTop/Back.png');

                @media only screen and (max-width: 850px) {
                    background-image: url(@/assets/img/map/4.DireTop/Back.mobile.png);
                }
            }

            .front-layer {
                background-image: url('@/assets/img/map/4.DireTop/Front.png');

                @media only screen and (max-width: 850px) {
                    background-image: url(@/assets/img/map/4.DireTop/Front.mobile.png);
                }
            }

            .foreground-layer {
                left: 25%;
                width: 50%;

            }
        }
    }
}
</style>
