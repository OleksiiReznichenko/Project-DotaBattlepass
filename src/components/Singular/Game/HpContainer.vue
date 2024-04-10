<script setup lang="ts">
import type fightEvent from "@/interfaces/fightEvent";
import type { LevelRequest } from '@/services/api/levels';
import { computed, onMounted, ref, watchEffect } from "vue";
interface Props {
    currentEvent: undefined | null | fightEvent;
    currentLevel: LevelRequest;
    prevLevel: LevelRequest | null;
    nextLevel: LevelRequest | null;
    userXp: number;
}

const props = defineProps<Props>();

const layerRed = ref<null | HTMLElement>(null);

const currentEventHp = computed(() => {
    if (props.nextLevel) {
        return props.nextLevel.points - props.userXp;
    }
});

const currentLevelXp = computed(() => {
    if (props.nextLevel) {
        return props.nextLevel.points - props.currentLevel.points;
    } else {
        return 0;
    }
})

const setHpBar = (): void => {
    if (!props.currentEvent || (!currentEventHp.value && currentEventHp.value !== 0) || !currentLevelXp.value || !layerRed.value) return;
    layerRed.value!.style.width = currentEventHp.value / currentLevelXp.value * 100 - 1.5 + '%';
};

watchEffect(() => {
    if (!props.currentEvent || (!currentEventHp.value && currentEventHp.value !== 0) || !currentLevelXp.value || !layerRed.value) return;
    setHpBar();
})

onMounted(() => {
    setHpBar();
})
</script>

<template>
    <div v-if="currentEvent && currentEvent.hp" class="event-info">
        <!-- <div class="title-container">
            <img :src="'/characterIcons/' + currentEvent.icon + '.png'" alt="" :class="{'mobile': currentEvent.hp}" class="event-icon">
            <span class="title">{{currentEvent.name}}</span>
        </div> -->
        <div v-if="currentEvent.hp" class="flex-container">
            <img :src="'/characterIcons/' + currentEvent.icon + '.png'" alt="" class="event-icon">
            <div class="hp-bar-container">
                <div class="hp-bar">
                    <div ref="layerRed" class="layer-red"></div>
                </div>
                <span class="hp">{{currentEventHp}} HP / {{currentLevelXp}} HP</span>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.event-info {
    position: fixed;
    top: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    text-align: center;

    @media only screen and (min-width: 850px) {
        top: 5rem;
    }

    .title-container {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: .5rem;

        @media only screen and (min-width: 850px) {
            margin-bottom: .2rem;
        }

        .title {
            text-shadow: 0px 2px 4px #000000;
        }
    }

    .flex-container {

        @media only screen and (min-width: 850px) {
            display: flex;
            align-items: center;
        }
    }

    .event-icon {
        width: 2rem;
        height: 2rem;
        margin-right: .8rem;
        filter: drop-shadow(0px 0px 4px rgba(225, 47, 47, 0.5)) drop-shadow(0px 0px 8px rgba(222, 91, 43, 0.6)) drop-shadow(0px 0px 14px rgba(217, 20, 93, 0.6));

        @media only screen and (min-width: 850px) {
            width: 2.5rem;
            height: 2.5rem;
            filter: unset;
        }
    }

    .hp-bar-container {
        position: relative;
        background-image: url(@/assets/svg/hpBarBackground.svg);
        background-size: 100%;
        background-repeat: no-repeat;
        width: 30rem;
        height: 1.9rem;
        overflow: hidden;

        @media only screen and (min-width: 850px) {
            width: 36rem;
            height: 2.2rem;
        }

        .hp-bar {
            width: 100%;
            height: 100%;
            overflow: hidden;

            .layer-red {
                background: linear-gradient(180deg, #FF1818 0%, #DC0000 15.94%, #C00000 37.81%, #C00000 62.81%, #E00000 82.08%, #FF2222 100%);
                box-shadow: 0px 0px 4px rgba(255, 60, 60, 0.7), 0px 0px 8px rgba(237, 14, 14, 0.25), 0px 0px 12px rgba(235, 10, 10, 0.5);
                position: absolute;
                top: .2rem;
                left: .2rem;
                height: 1.35rem;
                width: calc(100% - .8rem);
                transition: all .3s;

                @media only screen and (min-width: 450px) {
                    left: .3rem;
                }

                @media only screen and (min-width: 850px) {
                    height: 1.65rem;
                }
            }
        }

        .hp {
            @include abs-center;
            font-size: 1.2rem;
        }
    }
}
</style>