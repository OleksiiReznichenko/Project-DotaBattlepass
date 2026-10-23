<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
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
import { DEMO_MODE } from '@/demo/config';
import { demoAction, nextUnlockedEncounter } from '@/demo/progression';
import MyCharacter from '@/components/Reusable/Game/Sprites/MyCharacter.vue';
import CreepMelee from '@/components/Reusable/Game/Sprites/CreepMelee.vue';
import CreepRange from '@/components/Reusable/Game/Sprites/CreepRange.vue';
import type { LevelRequest } from '@/services/api/levels';

const baseStore = useBaseStore();
const { 
    activeEventLevel, completedEventLevels, currentUserAction, goToNextEvent, myCharacterPosition,
    myCharacterAction, creepAnimationIndicator, previewClosedIndicator,
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

const isHelpDismissed = ref(false);
const isViewingTutorialArea = ref(true);
const helpDismissalKey = 'dota-boom-demo-help-dismissed';

const dismissHelp = (): void => {
    isHelpDismissed.value = true;
    if (DEMO_MODE) {
        try {
            window.sessionStorage.setItem(helpDismissalKey, '1');
        } catch {
            // The close button must still work when session storage is unavailable.
        }
    }
};

const updateTutorialVisibility = (): void => {
    if (!DEMO_MODE || !mainMap.value) return;
    const cameraCenter = document.body.scrollLeft + window.innerWidth / 2;
    // The first tower and first Rune are in the opening 12% of the map.
    isViewingTutorialArea.value = cameraCenter <= mainMap.value.clientWidth * .12;
};
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
        return el.userLevel === (DEMO_MODE ? activeEventLevel.value : user.value.level);
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
        // In the demo, Go travels to the upcoming encounter. The legacy lookup
        // selected the previous encounter at intermediate levels (e.g. 6 -> 5,
        // although the next map destination is level 7), making Go appear stuck.
        let currentEvent = DEMO_MODE
            ? fightEvents.value.find(event => event.userLevel === activeEventLevel.value)
            : fightEvents.value.find((el, i, arr) => {
                if (el.userLevel === user.value.level) {
                    return el.userLevel === user.value.level;
                } else if (arr[i + 1]?.userLevel) {
                    return el.userLevel === user.value.level || (arr[i + 1] && user.value.level < arr[i + 1].userLevel);
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

        if (!DEMO_MODE && user.value.level < 3 && window.outerWidth > 1600) {
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

// Keep the camera movement synchronized with the hero's original 2.5s walk transition.
// Users can still take control by dragging, scrolling or choosing a region.
let demoCameraTween: gsap.core.Tween | null = null;

const stopDemoCamera = (): void => {
    demoCameraTween?.kill();
    demoCameraTween = null;
};

const calcScrollPosition = (): void => {
    if (!document.body || !user.value || !mainMap.value?.clientWidth) return;
    if (DEMO_MODE && myCharacter.value) {
        // Sprite artwork sits toward the left side of the character canvas.
        // Use its actual map position, not obsolete percentages of a 400vh map.
        const heroCenter = myCharacter.value.offsetLeft + myCharacterPosition.value +
            myCharacter.value.offsetWidth * .35;
        const maxScroll = Math.max(0, mainMap.value.clientWidth - window.innerWidth);
        const destination = Math.max(0, Math.min(maxScroll, heroCenter - window.innerWidth / 2));
        stopDemoCamera();
        if (!isScrollOnInitialPosition.value) {
            // Enter the game centered on the current hero, without an opening camera pan.
            document.body.scrollLeft = destination;
            isScrollOnInitialPosition.value = true;
        } else if (Math.abs(destination - document.body.scrollLeft) > 2) {
            const camera = { left: document.body.scrollLeft };
            demoCameraTween = gsap.to(camera, {
                left: destination,
                duration: 2.5,
                ease: 'power1.inOut',
                onUpdate: () => { document.body.scrollLeft = camera.left; },
                onComplete: () => { demoCameraTween = null; },
            });
        }
        return;
    }
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
        if (isRegistered.value || DEMO_MODE) {
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
    stopDemoCamera();
    let currentEventPosition = 0, currentEventIndex: number;
    if (!eventCircle.classList.contains('my-character')) {
        const id = eventCircle.dataset.id!;
        const currentEvent = fightEvents.value.find(el => el.id === Number(id));
        if (!currentEvent) return;
        currentEventIndex = fightEvents.value.findIndex(el => {
            return el.id === +id;
        });
        currentEventPosition = currentEvent.myCharacterLeftPosition;
    } else {
        const currentEvent = fightEvents.value.find((el, i, arr) =>
            el.userLevel === user.value.level || (arr[i + 1] && user.value.level < arr[i + 1].userLevel)
        ) || fightEvents.value[fightEvents.value.length - 1];
        if (!currentEvent) return;
        currentEventPosition = currentEvent.myCharacterLeftPosition;
        currentEventIndex = fightEvents.value.findIndex(el => {
            return el.id === +currentEvent.id;
        });
    }

    if (!currentEventPosition && currentEventPosition !== 0 || !mainMap.value) return;
    finishedAnimationIndicator.value = false;
    let scrollPosition = 0;
    if (isRegistered.value || DEMO_MODE) {
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


// The four original 400vh regions can be explored independently of XP.
// Navigation controls only the local horizontal scroll, not game progression.
const isRegionMenuOpen = ref(false);

const demoRegions = [
    { id: 'radiant', label: 'Radiant', progress: 0 },
    { id: 'river', label: 'River', progress: 0.255 },
    { id: 'dire', label: 'Dire', progress: 0.505 },
    { id: 'ancient', label: 'Ancient', progress: 0.755 },
] as const;

const goToRegion = (progress: number): void => {
    if (!DEMO_MODE || !mainMap.value) return;
    stopScrollingAnimationIndicator.value = true;
    stopDemoCamera();
    isRegionMenuOpen.value = false;
    const maxScroll = Math.max(0, mainMap.value.clientWidth - window.innerWidth);
    document.body.scrollTo({ left: Math.min(maxScroll, mainMap.value.clientWidth * progress), behavior: 'smooth' });
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

    if (!isRegistered.value && !DEMO_MODE) return;

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

let finishGoTimeout: ReturnType<typeof setTimeout> | null = null;
watch(goToNextEvent, (requested) => {
    if (!requested) return;

    // A movement request must always finish or reset. Previously the request
    // could stay pending if the map had not mounted yet.
    if (!myCharacter.value || !mainMap.value) {
        goToNextEvent.value = false;
        if (DEMO_MODE) {
            myCharacterAction.value = 'idle';
            checkUserAction(true);
        }
        return;
    }

    if (DEMO_MODE) {
        const destination = nextUnlockedEncounter(
            fightEvents.value, activeEventLevel.value, user.value.level
        );
        if (!destination) {
            goToNextEvent.value = false;
            myCharacterAction.value = 'idle';
            checkUserAction(true);
            return;
        }
        activeEventLevel.value = destination.userLevel;
    }

    calcCharacterPosition();
    calcScrollPosition();
    goToNextEvent.value = false;
    if (finishGoTimeout) clearTimeout(finishGoTimeout);
    finishGoTimeout = setTimeout(() => {
        finishGoTimeout = null;
        myCharacterAction.value = 'idle';
        // Update the available action only after reaching the destination.
        checkUserAction(true);
        updateProgressBarPositionIndicator.value = true;
    }, 2700);
}, { immediate: true, flush: 'post' });

let approachCreepsTimeout: ReturnType<typeof setTimeout> | null = null;
let opacityTimeout: ReturnType<typeof setTimeout> | null = null;
watch(creepAnimationIndicator, (active, _previous, onCleanup) => {
    if (!creepMelee.value || !creepRange.value || !mainMap.value) return;
    const melee = creepMelee.value;
    const ranged = creepRange.value;
    if (!active) {
        melee.style.opacity = '0';
        ranged.style.opacity = '0';
        return;
    }

    const encounter = fightEvents.value.find(event => event.userLevel ===
        (DEMO_MODE ? activeEventLevel.value : user.value.level));
    if (!encounter) return;
    const heroX = myCharacter.value
        ? myCharacter.value.offsetLeft + myCharacterPosition.value + myCharacter.value.offsetWidth * .38
        : mainMap.value.clientWidth * encounter.myCharacterLeftPosition / 100;
    const destination = DEMO_MODE ? heroX : heroX + window.innerWidth * .2;
    const start = destination + (DEMO_MODE ? Math.max(320, window.innerWidth * .35) : window.innerWidth);

    for (const creep of [melee, ranged]) {
        creep.style.transition = 'none';
        creep.style.opacity = '0';
        creep.style.transform = `translateX(${start}px)`;
    }
    // Force a layout boundary before starting their approach. They reach melee
    // range just before the hero's hit, not several seconds beforehand.
    approachCreepsTimeout = setTimeout(() => {
        melee.style.transition = 'transform .95s ease-out, opacity .15s';
        ranged.style.transition = 'transform .95s ease-out, opacity .15s';
        melee.style.opacity = '1';
        ranged.style.opacity = '1';
        melee.style.transform = `translateX(${destination}px)`;
        ranged.style.transform = `translateX(${destination + Math.min(115, window.innerWidth * .12)}px)`;
    }, 60);
    opacityTimeout = setTimeout(() => {
        melee.style.opacity = '0';
        ranged.style.opacity = '0';
        creepAnimationIndicator.value = false;
    }, 2750);

    onCleanup(() => {
        if (approachCreepsTimeout) clearTimeout(approachCreepsTimeout);
        if (opacityTimeout) clearTimeout(opacityTimeout);
        approachCreepsTimeout = null;
        opacityTimeout = null;
        melee.style.opacity = '0';
        ranged.style.opacity = '0';
    });
}, { flush: 'post' });

watchEffect(() => {
    if ((isRegistered.value && levels.value.length >= 1 || previewClosedIndicator.value) && myCharacter.value && currentUserAction.value !== 'go') {
        previewClosedIndicator.value = false;
        setTimeout(() => {
            calcCharacterPosition();
            // Don't yank the camera back while a visitor explores the full map.
            if (!DEMO_MODE) calcScrollPosition();
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
    if (DEMO_MODE) {
        currentUserAction.value = demoAction(
            fightEvents.value, activeEventLevel.value, user.value.level,
            completedEventLevels.value
        );
        return;
    }
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

// Tutorial text follows the encounter where the hero actually stands, not XP level.
// The two values can diverge after a high roulette reward.
const activeHelpPrompt = computed<number | null>(() => {
    if (isHelpDismissed.value || currentUserAction.value === 'go') return null;

    if (DEMO_MODE) {
        if (!isViewingTutorialArea.value) return null;
        if (activeEventLevel.value === 1) {
            if (currentUserAction.value === 'getFreeSpins') return 1;
            if (currentUserAction.value === 'farm') return 2;
        }
        if (activeEventLevel.value === 3 && currentUserAction.value === 'getRunes') return 4;
        return null;
    }

    // Retain the archived game's original guidance outside demo mode.
    if (!isRegistered.value) {
        if (user.value.level === 1 && currentUserAction.value === 'getFreeSpins') return 1;
        if (user.value.level === 2 || (user.value.level === 1 && currentUserAction.value === 'farm')) return 2;
        if (user.value.level === 3) return 4;
        if (user.value.level === 4) return 5;
        return null;
    }

    const nearStartOfLevel = currentLevelObject.value &&
        user.value.points - currentLevelObject.value.points <= 150;
    if (!nearStartOfLevel) return null;
    if (user.value.level === 1 && currentUserAction.value === 'getFreeSpins' && freeSpinsSpins.value) return 1;
    if (user.value.level === 1 && currentUserAction.value === 'farm' && attackFarmSpins.value) return 2;
    if (user.value.level === 3 && runesSpins.value) return 4;
    if (user.value.level === 13 && attackFarmSpins.value) return 6;
    if (user.value.level === 24 && attackFarmSpins.value) return 7;
    return null;
});

watch(currentEvent, () => {
    // In demo mode the arrival animation owns this transition. It must not
    // change Go into Attack while the hero is still walking to the enemy.
    if (!DEMO_MODE) checkUserAction(false);
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

// Register document-level drag/scroll listeners only while the game is mounted.
// Previously these listeners accumulated after visiting FAQ/Tasks and returning.
let isDragging = false;
let startDragX = 0;
let scrollLeftAtDragStart = 0;

const onMapMouseDown = (event: MouseEvent): void => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('.main-map') ||
        target.closest('button, a, input')) return;
    isDragging = true;
    stopDemoCamera();
    document.body.classList.add('body-grabbing');
    startDragX = event.pageX - document.body.offsetLeft;
    scrollLeftAtDragStart = document.body.scrollLeft;
};

const finishMapDrag = (): void => {
    isDragging = false;
    document.body.classList.remove('body-grabbing');
};

const onMapMouseMove = (event: MouseEvent): void => {
    if (!isDragging) return;
    event.preventDefault();
    const distance = (event.pageX - document.body.offsetLeft - startDragX) * 1.25;
    document.body.scrollLeft = scrollLeftAtDragStart - distance;
    if (scrollingAnimationIndicator.value) stopScrollingAnimationIndicator.value = true;
};

const onMapTouchMove = (): void => {
    if (scrollingAnimationIndicator.value) stopScrollingAnimationIndicator.value = true;
};

const onMapWheel = (event: WheelEvent): void => {
    if (event.ctrlKey) return;
    if (!(event.target instanceof Element) || !event.target.closest('.main-map')) return;
    if (scrollingAnimationIndicator.value) stopScrollingAnimationIndicator.value = true;
    stopDemoCamera();
    document.body.scrollLeft = gsap.utils.interpolate(
        document.body.scrollLeft,
        document.body.scrollLeft + event.deltaY + event.deltaX,
        .65
    );
};

const updateMapMeasurements = (): void => {
    if (!whiteLocation.value) return;
    halfWidth.value = window.innerWidth / 2;
    locationScrollWidth.value = whiteLocation.value.clientWidth - window.innerWidth;
    percentStep.value = locationScrollWidth.value / 100;
};

onMounted(() => {
    if (DEMO_MODE) {
        try {
            isHelpDismissed.value = window.sessionStorage.getItem(helpDismissalKey) === '1';
        } catch {
            // The demo remains functional when storage is blocked.
        }
    }
    if (window.innerWidth < 850) screenScrollTime.value = 1400;
    if (levels.value.length >= 1) {
        calcCharacterPosition();
        calcScrollPosition();
    }
    checkUserAction(false);

    if (isTouchDevice()) {
        polyfillIndex.value = .15;
        backLayerFormulaIndex.value = 9;
        foregroundLayerFormulaIndex.value = 20;
    }
    updateMapMeasurements();
    updateTutorialVisibility();

    document.body.addEventListener('scroll', updateTutorialVisibility);
    window.addEventListener('resize', updateTutorialVisibility);
    document.body.addEventListener('mousedown', onMapMouseDown);
    document.body.addEventListener('mouseleave', finishMapDrag);
    document.body.addEventListener('mouseup', finishMapDrag);
    document.body.addEventListener('mousemove', onMapMouseMove);
    document.body.addEventListener('touchmove', onMapTouchMove);
    document.body.addEventListener('wheel', onMapWheel);
    document.body.addEventListener('scroll', calcParallaxPosition);
    window.addEventListener('resize', updateMapMeasurements);
});

onUnmounted(() => {
    stopScrollingAnimationIndicator.value = true;
    stopDemoCamera();
    if (finishGoTimeout) clearTimeout(finishGoTimeout);
    if (approachCreepsTimeout) clearTimeout(approachCreepsTimeout);
    if (opacityTimeout) clearTimeout(opacityTimeout);
    finishMapDrag();
    document.body.removeEventListener('scroll', updateTutorialVisibility);
    window.removeEventListener('resize', updateTutorialVisibility);
    document.body.removeEventListener('mousedown', onMapMouseDown);
    document.body.removeEventListener('mouseleave', finishMapDrag);
    document.body.removeEventListener('mouseup', finishMapDrag);
    document.body.removeEventListener('mousemove', onMapMouseMove);
    document.body.removeEventListener('touchmove', onMapTouchMove);
    document.body.removeEventListener('wheel', onMapWheel);
    document.body.removeEventListener('scroll', calcParallaxPosition);
    window.removeEventListener('resize', updateMapMeasurements);
});
</script>

<template>
    <div ref="gamePage" :class="{'no-login': !isRegistered && !DEMO_MODE}" class="game-page">
        <nav v-if="DEMO_MODE" class="demo-map-navigation" aria-label="Explore map regions">
            <button
                type="button"
                class="demo-map-navigation__toggle"
                :aria-expanded="isRegionMenuOpen"
                aria-controls="demo-map-region-list"
                @click="isRegionMenuOpen = !isRegionMenuOpen"
            >Explore map <span aria-hidden="true">{{ isRegionMenuOpen ? '−' : '+' }}</span></button>
            <div v-if="isRegionMenuOpen" id="demo-map-region-list" class="demo-map-navigation__regions">
                <button
                    v-for="region in demoRegions"
                    :key="region.id"
                    type="button"
                    class="demo-map-navigation__button"
                    @click="goToRegion(region.progress)"
                >{{ region.label }}</button>
            </div>
        </nav>
        <RotateScreen />
        <RouletteScreen />
        <AwardsScreen />
        <RegistrationAwardWindow v-if="!isRegistered && !DEMO_MODE" />

        <Teleport to="body">
        <div v-if="activeHelpPrompt !== null" class="prompts-wrapper" :class="{'prompts-wrapper--combat': currentUserAction === 'attack'}">
            <button v-if="DEMO_MODE" type="button" class="prompts-wrapper__close" aria-label="Dismiss game tip" @click.stop.prevent="dismissHelp">×</button>
            <div v-if="activeHelpPrompt === 1" class="prompt prompt-1">
                <img src="/prompts/prompt1.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Добро пожаловать в <strong>DOTA BOOM</strong>! Нажми <strong>«Получить»</strong>, чтобы начать играть. -->
                    Welcome to <strong>DOTA BOOM</strong>! Click <strong>Get</strong>, to start playing.
                </p>
            </div>

            <div v-if="activeHelpPrompt === 2" class="prompt prompt-2">
                <img src="/prompts/prompt2.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>фарм</strong>. Получай <strong>опыт</strong>, чтобы перейти на следующий уровень. -->
                    This is <strong>farm</strong>. Get <strong>XP</strong>, to go to the next level.
                </p>
            </div>

            <div v-if="activeHelpPrompt === 3" class="prompt prompt-3">
                <img src="/prompts/prompt3.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>дружеская башня</strong>. Она дает бесплатные <strong>ходы</strong>. -->
                    This is <strong>friendly tower</strong>. It gives you free <strong>moves</strong>.
                </p>
            </div>

            <div v-if="activeHelpPrompt === 4" class="prompt prompt-4">
                <img src="/prompts/prompt4.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>руна</strong>. Она дает <strong>бонусы</strong>. -->
                    This is <strong>rune</strong>. It gives you <strong>bonuses</strong>.
                </p>
            </div>

            <div v-if="activeHelpPrompt === 5" class="prompt prompt-5">
                <img src="/prompts/prompt5.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>вражеский герой</strong>. Срази его и получи <strong>награду</strong>. -->
                    This is <strong>enemy hero</strong>. Fight him and get a <strong>reward</strong>.
                </p>
            </div>

            <div v-if="activeHelpPrompt === 6" class="prompt prompt-6">
                <img src="/prompts/prompt6.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Это <strong>вражеская башня</strong>. Уничтожь её и получи <strong>награду</strong>. -->
                    This is <strong>enemy tower</strong>. Destroy it to get a <strong>reward</strong>.
                </p>
            </div>

            <div v-if="activeHelpPrompt === 7" class="prompt prompt-7">
                <img src="/prompts/prompt7.png" alt="" class="prompt__image">
                <p class="prompt__description">
                    <!-- Ты добрался до <strong>Трона</strong>! Уничтожь его, чтобы пройти <strong>игру</strong>. -->
                    Have you reached the <strong>Throne</strong>! Destroy to finish the <strong>game</strong>.
                </p>
            </div>
        </div>
        </Teleport>
        
        <div class="inner-container">
            <HpContainer v-if="currentEvent?.hp && currentUserAction !== 'go' && (!DEMO_MODE || (currentUserAction === 'attack' && !completedEventLevels.includes(activeEventLevel)))"
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
                <img v-if="isRegistered || DEMO_MODE" src="@/assets/img/map/1.Divider.png" alt="" class="divider divider-1">
                <div v-if="isRegistered || DEMO_MODE" class="location river-location">
                    <div ref="riverLayerBack" class="layer base-layer"></div>
                    <div class="layer front-layer"></div>
                </div>
                <div v-if="isRegistered || DEMO_MODE" class="foreground-layer-container river-location__foreground-layer-container">
                    <img ref="riverLayerForeground" src="@/assets/img/map/2.River/Foreground.png" class="layer foreground-layer">
                </div>
                <img v-if="isRegistered || DEMO_MODE" src="@/assets/img/map/2.Divider.png" alt="" class="divider divider-2">
                <div v-if="isRegistered || DEMO_MODE" class="location red-location">
                    <div ref="redLayerBack" class="layer base-layer"></div>
                    <div class="layer front-layer"></div>
                </div>
                <div v-if="isRegistered || DEMO_MODE" class="foreground-layer-container red-location__foreground-layer-container">
                    <img ref="redLayerForeground" src="@/assets/img/map/3.Dire/Foreground.png" class="layer foreground-layer">
                </div>
                <img v-if="isRegistered || DEMO_MODE" src="@/assets/img/map/3.Divider.png" alt="" class="divider divider-3">
                <div v-if="isRegistered || DEMO_MODE" class="location black-location">
                    <div ref="blackLayerBack" class="layer base-layer"></div>
                    <div class="layer front-layer"></div>
                </div>
                <div v-if="isRegistered || DEMO_MODE" class="foreground-layer-container black-location__foreground-layer-container">
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
.demo-map-navigation {
    position: fixed;
    bottom: 5rem;
    left: 1rem;
    z-index: 9500;
    max-width: calc(100vw - 2rem);
    font-family: 'Gilroy', sans-serif;

    &__toggle,
    &__button {
        min-height: 2.8rem;
        border: .1rem solid rgba(255, 255, 255, .2);
        border-radius: .5rem;
        color: #eaeaea;
        background: rgba(25, 26, 30, .95);
        font-family: inherit;
        font-size: 1rem;
        font-weight: 700;
        cursor: pointer;
        transition: background .2s, border-color .2s;

        &:hover,
        &:focus-visible {
            border-color: #4cdc58;
            background: rgba(45, 65, 48, .96);
        }
    }

    &__toggle {
        display: flex;
        align-items: center;
        gap: .7rem;
        padding: .5rem .9rem;
        box-shadow: 0 .5rem 2rem rgba(0, 0, 0, .4);
    }

    &__regions {
        position: absolute;
        left: 0;
        bottom: calc(100% + .5rem);
        display: flex;
        flex-direction: column;
        gap: .4rem;
        padding: .5rem;
        border: .1rem solid rgba(255, 255, 255, .2);
        border-radius: .7rem;
        background: rgba(25, 26, 30, .96);
        box-shadow: 0 .5rem 2rem rgba(0, 0, 0, .4);
    }

    &__button {
        min-width: 7rem;
        padding: .5rem .8rem;
        text-align: left;
    }

    @media only screen and (max-width: 850px) {
        top: max(.5rem, env(safe-area-inset-top));
        right: .5rem;
        bottom: auto;
        left: auto;

        &__regions {
            right: 0;
            left: auto;
            top: calc(100% + .5rem);
            bottom: auto;
        }

        &__toggle,
        &__button {
            font-size: .95rem;
        }
    }

    @media only screen and (max-height: 550px) {
        &__regions {
            max-height: 55vh;
            overflow-y: auto;
        }
    }
}

.prompts-wrapper {
    position: fixed;
    top: 7rem;
    left: 0;
    transition: all .2s;
    width: 100%;
    height: 7rem;
    z-index: 9000;
    pointer-events: none;

    &--combat {
        top: 13rem;
    }

    &__close {
        position: absolute;
        z-index: 2;
        top: -.3rem;
        right: max(.8rem, calc(50% - 17rem));
        width: 2rem;
        height: 2rem;
        border: .1rem solid rgba(255, 255, 255, .35);
        border-radius: 50%;
        color: #fff;
        background: #25262b;
        font-size: 1.4rem;
        cursor: pointer;
        pointer-events: auto;
    }

    @media only screen and (max-width: 850px) {
        top: 4.5rem;
        &--combat { top: 4.5rem; }
    }

    .prompt {
        @include abs-center;
        @include textureBackground;
        @include flex-center;
        top: 1rem;
        justify-content: flex-end;
        transform: translateX(-50%);
        width: min(34rem, calc(100vw - 2rem));
        height: 6.4rem;
        z-index: 1;
        padding: .6rem;
        transition: all .2s;
        border-top-left-radius: 20px;;
        border-bottom-left-radius: 20px;;

        @media only screen and (min-width: 850px) {
            top: .5rem;
            width: min(35rem, calc(100vw - 2rem));
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
            width: calc(100% - 8rem);

            @media only screen and (min-width: 850px) {
                width: calc(100% - 8rem);
                font-size: 16px;
            }
        }
    }
    @media only screen and (max-width: 600px) {
        .prompt {
            width: min(31rem, calc(100vw - 1rem));
            min-height: 5.6rem;
            height: auto;
            padding: .5rem .8rem .5rem 5.5rem;

            &__image {
                top: 0;
                left: -.3rem;
                width: 5.5rem;
                height: 5.5rem;
            }

            &__description {
                width: 100%;
                font-size: 1rem;
                line-height: 1.3;
            }
        }
    }

}


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
