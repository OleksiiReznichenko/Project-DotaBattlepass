<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useLevelsStore } from '@/stores/levels';
import { useEventsStore } from '@/stores/events';
import EventCircle from "@/components/Reusable/Game/EventCircle.vue";

const baseStore = useBaseStore();
const { endLightLineIndicator, currentUserAction, updateProgressBarPositionIndicator, previewClosedIndicator } = storeToRefs(baseStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const levelsStore = useLevelsStore();
const { levels } = storeToRefs(levelsStore);

const eventsStore = useEventsStore();
const { fightEvents } = storeToRefs(eventsStore);

const layerYellow = ref<null | HTMLElement>(null);
const layerGrey = ref<null | HTMLElement>(null);

const points = computed(() => {
    if (levels.value.length < 1) return 0;
    return levels.value[levels.value.length - 1].points;
});

const eventCircles = computed(() => {
    if (levels.value.length < 1) return;
    if (isRegistered.value) {
        return fightEvents.value.map(el => {
            const level = levels.value.find((level) => {
                return level.levelId === el.userLevel;
            })!;
            if (!level) return;
            const nextLevel = levels.value.find((level) => {
                return level.levelId === el.userLevel + 1;
            });
            const prevLevel = levels.value.find((level) => {
                return level.levelId === el.userLevel - 1;
            });
            let xp = 0;
            if (nextLevel) {
                xp = level.points;

                if (!prevLevel) {
                    xp = 0;
                }
            } else {
                xp = level.points;
            }
            let leftPosition = Math.floor(xp / points.value * 100) + '%';
            if (Math.floor(xp / points.value * 100) >= 97) {
                leftPosition = '97%';
            }
            if (Math.floor(xp / points.value * 100) < 1) {
                leftPosition = '1%';
            }
            const icon = el.icon;
            const eventId = el.id;
            const isFinished = user.value.level > el.userLevel || (user.value.level >= el.userLevel && currentUserAction.value !== 'go');

            return {leftPosition, icon, eventId, isFinished};
        })
    } else {
        return fightEvents.value.map(el => {
            const level = levels.value.find((level) => {
                return level.levelId === el.userLevel;
            })!;
            if (!level) return;
            const nextLevel = levels.value.find((level) => {
                return level.levelId === el.userLevel + 1;
            });
            const prevLevel = levels.value.find((level) => {
                return level.levelId === el.userLevel - 1;
            });
            let xp = 0;
            if (nextLevel) {
                xp = level.points;

                if (!prevLevel) {
                    xp = 0;
                }
            } else {
                xp = level.points;
            }
            let leftPosition = Math.floor(xp / points.value * 100) + '%';
            if (Math.floor(xp / points.value * 100) >= 97) {
                leftPosition = '97%';
            }
            if (Math.floor(xp / points.value * 100) < 1) {
                leftPosition = '1%';
            }
            const icon = el.icon;
            const eventId = el.id;
            const isFinished = user.value.level > el.userLevel || (user.value.level >= el.userLevel && currentUserAction.value !== 'go');

            return {leftPosition, icon, eventId, isFinished};
        })
    }
});

watchEffect(() => {
    if (!layerYellow.value || !layerGrey.value) return;
    const layerWidth = user.value.points / points.value * 100 + '%'
    layerYellow.value!.style.width = layerWidth;
    layerGrey.value!.style.width = layerWidth;
})

watchEffect(() => {
    if (!layerYellow.value || !layerGrey.value) return;
    if (isRegistered.value && endLightLineIndicator.value) {
        const layerWidth = user.value.points / points.value * 100 + '%'
        layerYellow.value!.style.width = layerWidth;
        layerGrey.value!.style.width = layerWidth;
    }
})

let isInit = ref<boolean>(true);
let currentPosition = ref<string>('');

const myPosition = computed(() => {
    if (levels.value.length < 1) return;
    if (updateProgressBarPositionIndicator.value || previewClosedIndicator.value) {
        const currentEvent = fightEvents.value.find((el, i, arr) => {
            return el.userLevel === user.value.level || user.value.level - arr[i + 1].userLevel < 0;
        });
        const currentEventLevel = levels.value.find(el => {
            return el.levelId === currentEvent?.userLevel;
        })
        if (currentEventLevel) {
            const nextLevel = levels.value.find((level) => {
                return level.levelId === currentEventLevel.levelId + 1;
            })!;
            const prevLevel = levels.value.find((level) => {
                return level.levelId === currentEventLevel.levelId - 1;
            })!;
            let levelXp = 0;
            if (prevLevel) {
                levelXp = currentEventLevel.points;
            } else {
                levelXp = 0;
            }
            currentPosition.value = Math.floor(levelXp / points.value * 100) - 3 + '%';
            updateProgressBarPositionIndicator.value = false;
        }
    }
    return currentPosition.value;
})
</script>

<template>
    <div class="progress-bar-container">
        <div class="progress-bar-inner-container">
            <div class="progress-bar">
                <div ref="layerGrey" class="layer layer-grey"></div>
                <div ref="layerYellow" class="layer layer-yellow"></div>
            </div>
            <div v-if="eventCircles && eventCircles?.length >= 1" class="event-circles">
                <EventCircle 
                    v-for="eventCircle in eventCircles"
                    :left-position="eventCircle?.leftPosition"
                    :icon="eventCircle?.icon"
                    :eventId="eventCircle?.eventId"
                    :is-finished="eventCircle?.isFinished"
                    :total-xp="points"
                />
                <div :style="{'left': myPosition}" class="active finished event-circle my-character">
                    <div class="central-circle">
                        <img src="/characterIcons/Hero_Radiant.png" alt="Hero Radiant" class="event-icon">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.progress-bar-container {
    position: relative;
    // display: flex;
    // align-items: center;
    width: 100%;
    min-width: 1400px;
    height: 2.85rem;
    background-image: url(@/assets/img/texture.png), linear-gradient(180deg, #2C292E 0%, #191A1E 100%);
    padding: 0 1.6rem;
    z-index: 1000;
    // overflow-x: scroll;

    // @media only screen and (max-width: 1400px) {
    //     min-width: 2800px;
    // }

    .progress-bar-inner-container {
        // position: absolute;
        // top: 50%;
        // right: 1.6rem;
        // transform: translateY(-50%);
        display: flex;
        align-items: center;
        height: 2.85rem;
        width: 100%;
        overflow-x: scroll;

        // @media only screen and (max-width: 1400px) {
        //     width: 1400px;
        // }
    }


    .event-circles {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
    }

    .progress-bar {
        position: relative;
        width: 100%;
        height: 1.4rem;
        background-image: url(@/assets/svg/mapProgressBarBackground.svg);
        background-size: cover;
        background-repeat: no-repeat;
        border-radius: 1.5rem;
        // overflow-x: scroll;

        // @media only screen and (max-width: 1400px) {
        //     width: 1400px;
        // }

        .layer {
            position: absolute;
            top: .2rem;
            left: .25rem;
            height: 1rem;
            border-radius: 1.5rem;
            transition: all .3s;
        }   

        .layer-grey {
            background: linear-gradient(180deg, #FFD600 0%, #FFB800 11.77%, #FF8A00 39.37%, #FF8A00 56.04%, #FFB800 89.9%, #FFD600 100%);
            mix-blend-mode: luminosity;

            width: 0%;
        }

        .layer-yellow {
            background: linear-gradient(180deg, #FFD600 0%, #FFB800 11.77%, #FF8A00 39.37%, #FF8A00 56.04%, #FFB800 89.9%, #FFD600 100%);
            box-shadow: 0px 0px 4px rgba(255, 200, 60, 0.7), 0px 0px 8px rgba(237, 161, 14, 0.25), 0px 0px 12px rgba(235, 172, 10, 0.5);
            z-index: 100;

            width: 0%;
        }
    }
}
.my-character {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%) translateX(30%);
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 100%;
    background-color: var(--color-grey-2);
    cursor: pointer;
    transition: all .5s;

    .central-circle {
        @include abs-center;
        @include flex-center;
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 100%;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, .75);

        .event-icon {
            width: 1.4rem;
            height: 1.4rem;
        }
    }
}

.finished {
    .central-circle {
        background-image: radial-gradient(53.12% 53.12% at 50% 50%, #FFAF00 0%, #FF8A00 0.01%, #FF8A00 37.81%, #FFAF00 81.04%, #FFCC00 100%);
        box-shadow: 0px 0px 2px #FFB600;
    }
}

.active {
    border-radius: 0;
    background-image: url(@/assets/svg/activeEventItemProgressMap.svg);
    background-color: unset;
    background-size: 100%;
    background-repeat: no-repeat;
    width: 2.6rem;
    height: 2.2rem;
    
    .central-circle {
        width: 2.1rem;
        height: 1.9rem;
        border-radius: 0;
        background-image: url(@/assets/svg/activeFinishedEventItemProgressMap.svg);
        background-size: 100%;
        background-repeat: no-repeat;
        box-shadow: unset;
        left: 49%;

        .event-icon {
            margin-left: -.2rem;
        }
    }
}
</style>