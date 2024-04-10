<script setup lang="ts">
import { useBaseStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useRoulettesStore } from '@/stores/roulettes';
import { useEventsStore } from '@/stores/events';
import { useLevelsStore } from '@/stores/levels';
import { useRouletteStore } from '@/stores/roulette';
import { RouletteType } from '@/services/api/roulette';
import { storeToRefs } from "pinia";
import { computed } from 'vue';
import { onMounted, reactive, ref, watchEffect } from '@vue/runtime-core';
import Roulette from "@/components/Reusable/Game/Roulette.vue";
import router from '@/router';


const isRouletteClicked = reactive({
    farm: false,
    runic: false,
    spin: false,
})
const baseStore = useBaseStore();
const { 
    updateProgressBarPositionIndicator, isRouletteWindowOpened, currentUserAction, 
    rouletteGottenValue, goToNextEvent, myCharacterAction, allowToOpenRoulette,
    creepAnimationIndicator
} = storeToRefs(baseStore);

const userStore = useUserStore();
const { user, spinsAmount } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const roulettesStore = useRoulettesStore();
const { roulettAttackFarm, roulettFreeSpins, roulettRunes } = storeToRefs(roulettesStore);

const eventsStore = useEventsStore();
const { fightEvents } = storeToRefs(eventsStore);

const levelsStore = useLevelsStore();
const { levels } = storeToRefs(levelsStore);

const rouletteStore = useRouletteStore();
const { roulettes, winId } = storeToRefs(rouletteStore);

const typeRoulette = {
    'attack': RouletteType.FARM,
    'farm': RouletteType.FARM,
    'getRunes': RouletteType.RUNIC,
    'getFreeSpins': RouletteType.MINE,
    'go': null,
};

const currentRouletteState = computed(() => {
    // if (currentUserAction.value === 'go') {
    //     return 0;
    // }
    if (!isRegistered.value) {
        return spinsAmount.value;
    }
    if (!roulettes.value || roulettes.value.length < 1) return 0;
    let spins = roulettes.value.find((item) => {
        if (currentUserAction.value === 'getRunes') {
            return item.name === RouletteType.RUNIC;
        } else if (currentUserAction.value === 'getFreeSpins') {
            return item.name === RouletteType.MINE;
        } else if (currentUserAction.value === 'attack' || currentUserAction.value === 'farm' || currentUserAction.value === 'go') {
            return item.name === RouletteType.FARM;
        }  
    })!.state.spins;

    // if (!spins && isRegistered.value || (!spins || spins && spins < 0)) {
    //     spins = 0;
    // }
    if (spins < 0) {
        spins = 0;
    }

    spinsAmount.value = spins;
    return spinsAmount.value;
})

const spinsText = computed(() => {
    if (spinsAmount.value === 1) {
        return 'Move';
    } else if (spinsAmount.value > 1 && spinsAmount.value < 5) {
        // return 'Хода';
        return 'Moves';
    } else {
        // return 'Ходов';
        return 'Moves';
    }
})

const openWindow = (): void => {
    if (!allowToOpenRoulette.value) return;
    isRouletteWindowOpened.value = true;
    spinsAmount.value -= 1;
    myCharacterAction.value = 'idle';
    creepAnimationIndicator.value = false;
    allowToOpenRoulette.value = false;
}

// const attackFarmSpins = computed(() => {
//     let spins = roulettes.value.find(el => {
//         return el.name === RouletteType.FARM;
//     })?.state.spins;
//     if (!spins) {
//         spins = 0;
//     }
//     return spins;
// });

const showRunes = computed(() => {
    return currentUserAction.value === 'getRunes' && ((runesSpins.value && runesSpins.value >= 1 && isRegistered.value) || !isRegistered.value);
})

const showFreeSpins = computed(() => {
    return currentUserAction.value === 'getFreeSpins' && ((freeSpinsSpins.value && freeSpinsSpins.value >= 1 && isRegistered.value) || !isRegistered.value);
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
    // if (!runesSpins.value) {
    //     runesSpins.value = 0;
    // }

    freeSpinsSpins.value = roulettes.value.find(el => {
        return el.name === RouletteType.MINE;
    })?.state.spins;
    
    // if (!freeSpinsSpins.value) {
    //     freeSpinsSpins.value = 0;
    // }

    // console.log('freeSpinsSpins', freeSpinsSpins.value);
})

// watchEffect(() => {
//     if (!isRegistered.value) return;
//     if (currentUserAction.value === 'getFreeSpins' && (freeSpinsSpins.value < 1) || 
//     currentUserAction.value === 'getRunes' && (runesSpins.value < 1)) {
//         currentUserAction.value = 'farm';
//     }
// })

// watchEffect(() => {
//     if (!isRegistered.value) return;
//     if (currentUserAction.value === 'getFreeSpins' && (!freeSpinsSpins.value || freeSpinsSpins.value < 1) || 
//     currentUserAction.value === 'getRunes' && (!runesSpins.value || runesSpins.value < 1)) {
//         currentUserAction.value = 'farm';
//     }
// })

const attack = (): void => {
    if (!allowToOpenRoulette.value) return;

    // const spins = roulettes.value.find(el => {
    //     return el.name === RouletteType.FARM;
    // })?.state.spins;

    // if (!attackFarmSpins.value && isRegistered.value) return;

    if (!attackFarmSpins.value && isRegistered.value) {
        router.push('/tasks');
        return;
    }
    isRouletteClicked.farm = true;
    isRouletteClicked.runic = false;
    isRouletteClicked.spin = false;

    if (user.value.points >= levels.value[levels.value.length - 1].points) return;
    openWindow();
    if (isRegistered.value) {
        rouletteStore.playSpinRoulette(RouletteType.FARM)
    } else {
        rouletteGottenValue.value = roulettesStore.generateRotationAndValue(roulettAttackFarm.value, false);
    }
};

const farm = (): void => {
    if (!allowToOpenRoulette.value) return;

    // const spins = roulettes.value.find(el => {
    //     return el.name === RouletteType.FARM;
    // })?.state.spins;

    if (!attackFarmSpins.value && isRegistered.value) {
        router.push('/tasks');
        return;
    }
    isRouletteClicked.farm = true;
    isRouletteClicked.runic = false;
    isRouletteClicked.spin = false;

    if (user.value.points >= levels.value[levels.value.length - 1].points) return;
    openWindow();
    if (isRegistered.value) {
        rouletteStore.playSpinRoulette(RouletteType.FARM)
    } else {
        rouletteGottenValue.value = roulettesStore.generateRotationAndValue(roulettAttackFarm.value, false);
    }
};

watchEffect(() => {
    if(winId.value && isRouletteClicked.farm && isRegistered.value) {
        rouletteGottenValue.value = roulettesStore.generateRotationAndValue(roulettAttackFarm.value, true);
    }
    if(winId.value && isRouletteClicked.spin && isRegistered.value) {
        rouletteGottenValue.value = roulettesStore.generateRotationAndValue(roulettFreeSpins.value, true);
    }
    if(winId.value && isRouletteClicked.runic && isRegistered.value) {
        rouletteGottenValue.value = roulettesStore.generateRotationAndValue(roulettRunes.value, true);
    }
})

const getFreeSpins = (): void => {
    if (!allowToOpenRoulette.value) return;

    // const spins = roulettes.value.find(el => {
    //     return el.name === RouletteType.MINE;
    // })?.state.spins;

    if (!freeSpinsSpins.value && isRegistered.value) return;
    isRouletteClicked.farm = false;
    isRouletteClicked.runic = false;
    isRouletteClicked.spin = true;

    if (user.value.points >= levels.value[levels.value.length - 1].points) return;
    openWindow();
    if (isRegistered.value) {
        rouletteStore.playSpinRoulette(RouletteType.MINE)
    } else {
        rouletteGottenValue.value = roulettesStore.generateRotationAndValue(roulettFreeSpins.value, false);
    }
};

const getRunes = (): void => {
    if (!allowToOpenRoulette.value) return;

    // const spins = roulettes.value.find(el => {
    //     return el.name === RouletteType.RUNIC;
    // })?.state.spins;

    if (!runesSpins.value && isRegistered.value) return;
    isRouletteClicked.farm = false;
    isRouletteClicked.runic = true;
    isRouletteClicked.spin = false;

    if (user.value.points >= levels.value[levels.value.length - 1].points) return;
    openWindow();
    if (isRegistered.value) {
        rouletteStore.playSpinRoulette(RouletteType.RUNIC);
    } else {
        rouletteGottenValue.value = roulettesStore.generateRotationAndValue(roulettRunes.value, false);
    }
};

const go = (): void => {
    if (user.value.points >= levels.value[levels.value.length - 1].points) return;
    const currentEvent = fightEvents.value.find(el => {
        return el.userLevel === user.value.level;
    });
    if (!currentEvent) return;
    myCharacterAction.value = 'walk';
    setTimeout(() => {
        goToNextEvent.value = true;
    }, 800);
};
</script>

<template>
    <div class="action-panel">
        <div class="center">
            <img src="@/assets/svg/actionPanel/actionPanelLeftPeace.svg" alt="" class="peace left-peace">
            <div class="main-rectangle-container">
                <!-- <img src="@/assets/svg/actionPanel/actionPanelMainRectangle.png" alt="" class="main-rectangle"> -->
                <div class="main-rectangle"></div>
                <img src="@/assets/svg/actionPanel/actionPanelMainRectangleLine.svg" alt="" class="main-rectangle-line">
            </div>
            <div class="info">
                <div class="avatar-container">
                    <!-- <img src="@/assets/img/userAvatar.png" alt="" class="avatar"> -->
                    <div class="avatar"></div>
                    <div class="level-container">
                        <span class="level">{{user.level}}</span>
                    </div>
                </div>
                <Roulette class="button-background" />
                <div class="action-button-container">
                    <!-- <Transition name="fade"> -->
                        <img src="@/assets/img/spheres/redSphere.png" alt="" class="sphere">
                        <button v-if="currentUserAction === 'attack'" @click="attack" class="action-button red-sphere">
                            <!-- <span>Атака</span> -->
                            <span>Attack</span>
                        </button>
                    <!-- </Transition> -->
                    <!-- <Transition name="fade"> -->
                        <img src="@/assets/img/spheres/yellowSphere.png" alt="" class="sphere">
                        <button v-if="currentUserAction === 'farm'" @click="farm" class="action-button yellow-sphere">
                            <!-- <span>Фарм</span> -->
                            <span>Farm</span>
                        </button>
                    <!-- </Transition> -->
                    <!-- <Transition name="fade"> -->
                        <img src="@/assets/img/spheres/purpleSphere.png" alt="" class="sphere">
                        <button v-if="showRunes" @click="getRunes" class="action-button purple-sphere">
                            <!-- <span>Получить</span> -->
                            <span>Get</span>
                        </button>
                    <!-- </Transition> -->
                    <!-- <Transition name="fade"> -->
                        <img src="@/assets/img/spheres/purpleSphere.png" alt="" class="sphere">
                        <button v-if="showFreeSpins" @click="getFreeSpins" class="action-button purple-sphere">
                            <!-- <span>Получить</span> -->
                            <span>Get</span>
                        </button>
                    <!-- </Transition> -->
                    <!-- <Transition name="fade"> -->
                        <img src="@/assets/img/spheres/greenSphere.png" alt="" class="sphere">
                        <button v-if="currentUserAction === 'go'" @click="go" class="action-button green-sphere">
                            <!-- <span>Идти</span> -->
                            <span>Go</span>
                        </button>
                    <!-- </Transition> -->
                </div>
                <router-link to="/tasks" class="spins-info">
                    <span class="spins-amount">{{currentRouletteState}}</span>
                    <span class="spins-text">{{spinsText}}</span>
                    <img src="@/assets/svg/arrow.svg" alt="Arrow" class="arrow">
                </router-link>
            </div>
            <img src="@/assets/svg/actionPanel/actionPanelRightPeace.svg" alt="" class="peace right-peace">
        </div>
    </div>
</template>

<style lang="scss" scoped>
.action-panel {
    width: 100%;
    position: relative;

    @media only screen and (max-width: 650px) and (max-height: 650px) {
        transform: scale(.9);
    }

    .peace {
        position: absolute;
        bottom: -3px;
        width: 12rem;
    }

    .left-peace {
        left: -10%;
    }

    .right-peace {
        right: -10%;
    }

    .center {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        height: 8rem;
        width: 35rem;

        .main-rectangle-container {
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 100;

            .main-rectangle,
            .main-rectangle-line {
                @include abs-center;
                height: 100%;
                width: 100%;
            }

            .main-rectangle {
                @include textureBackground;
                clip-path: polygon(6.5% 0%, 93.5% 0%, 100% 100%, 0% 100%);
            }
            
            .main-rectangle-line {
                top: 45%;
            }
        }

        .info {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: space-between;
            z-index: 1000;

            .action-button-container {
                @include flex-center;
                width: 20rem;
                height: 20rem;

                position: absolute;
                bottom: -6rem;
                left: 50%;
                transform: translateX(-50%) scale(.95);


                .action-button {
                    @include flex-center;
                    font-family: Reaver;
                    font-size: 2.6rem;
                    background-size: 100%;
                    width: 80%;
                    height: 80%;
                    border-radius: 100%;
                    overflow: hidden;
                    position: relative;
                    z-index: 200;

                    span {
                        position: relative;
                        z-index: 100;
                        color: transparent;
                        background-color: white;
                        text-shadow: 0px 2px 7px rgba(#000000, 32%),
                        0px -1px 1px rgba(#FFFFFF, 25%);
                        -webkit-background-clip: text;
                        -moz-background-clip: text;
                        background-clip: text;
                    }
                }
                .sphere {
                    @include abs-center;
                    width: 10rem;
                    height: 10rem;
                    display: none;
                }

                .red-sphere {
                    width: 85%;
                    height: 85%;
                    background-image: url(@/assets/img/spheres/redSphere.png);
                }

                .yellow-sphere {
                    width: 81%;
                    height: 81%;
                    background-image: url(@/assets/img/spheres/yellowSphere.png);
                }

                .purple-sphere {
                    width: 75%;
                    height: 75%;
                    background-image: url(@/assets/img/spheres/purpleSphere.png);
                }

                .green-sphere {
                    width: 75%;
                    height: 75%;
                    background-image: url(@/assets/img/spheres/greenSphere.png);
                }
            }

            .avatar-container {
                position: relative;
                height: 7rem;
                width: 6rem;
                margin-top: .5rem;
                margin-left: .65rem;

                .avatar {
                    clip-path: polygon(32% 0%, 100% 0%, 100% 100%, 0% 100%);
                    background-image: url(@/assets/img/myAvatar.jpg);
                    background-size: cover;
                    width: 100%;
                    height: 100%;
                    border-radius: 3px;
                }

                .level-container {
                    @include textureBackground;
                    @include flex-center;
                    position: absolute;
                    bottom: -.5rem;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 2.3rem;
                    height: 2.3rem;
                    border-radius: 100%;
                    border: 2px solid #697980;

                    .level {
                        font-weight: 500;
                        background-image: linear-gradient(180deg, #FFC701 0%, #E04F21 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                        background-blend-mode: soft-light, normal;
                    }
                }
            }

            .spins-info {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 6.5rem;
                margin-right: 1.25rem;

                .spins-amount {
                    font-family: Reaver;
                    font-size: 2.3rem;
                    color: transparent;
                    background-color: #C9DEE7;
                    text-shadow: 0px 2px 2px rgba(#000000, 32%),
                    0px -1px 1px rgba(#FFFFFF, 25%);
                    -webkit-background-clip: text;
                    -moz-background-clip: text;
                    background-clip: text;
                    display: inline-block;
                    margin-bottom: .4rem;
                }

                .spins-text {
                    font-weight: 500;
                    font-size: 1.2rem;
                    color: transparent;
                    background-color: #77888F;
                    text-shadow: 0px 2px 2px rgba(#000000, 32%),
                    0px -1px 1px rgba(#FFFFFF, 25%);
                    -webkit-background-clip: text;
                    -moz-background-clip: text;
                    background-clip: text;
                    display: inline-block;
                    margin-bottom: 1rem;
                }

                .arrow {
                    width: 1rem;
                }
            }
        }
    }
}
</style>