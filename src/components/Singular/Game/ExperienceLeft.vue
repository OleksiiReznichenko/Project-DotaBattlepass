<script setup lang="ts">
import { useBaseStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useLevelsStore } from '@/stores/levels';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';

const baseStore = useBaseStore();
const { currentUserAction, allLevelsFinishedIndicator } = storeToRefs(baseStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const levelsStore = useLevelsStore();
const { levels } = storeToRefs(levelsStore);

const experienceLeft = computed(() => {
    if (levels.value.length < 1) return 0;
    const currentLevel = levels.value.find((el, i, arr) => {
        if (i + 1 === arr.length) return el.points;
        return user.value.points - el.points < 0;
    })

    // console.log('currentLevel', currentLevel!.points, user.value.points)

    return currentLevel!.points - user.value.points;
});
</script>

<template>
    <div class="experience-container">
        <img src="@/assets/svg/experienceLeft/leftPeace.svg" alt="" class="peace left-peace">
        <div class="info-container">
            <img src="@/assets/svg/experienceLeft/mainRectangle.svg" alt="" class="main-rectangle">
            <div v-if="experienceLeft && experienceLeft > 0 && currentUserAction !== 'go' && !allLevelsFinishedIndicator" class="info">
                <span class="experience-left">{{experienceLeft}} XP</span>
                <!-- <span class="subtitle">до нового уровня</span> -->
                <span class="subtitle">before the new level</span>
            </div>
            <div v-if="currentUserAction === 'go' && !allLevelsFinishedIndicator" class="info">
                <!-- <span class="no-experience-left">Ты уже заработал XP!</span> -->
                <span class="no-experience-left">You've already earned XP!</span>
                <!-- <span class="subtitle">для нового эвента</span> -->
                <span class="subtitle">for a new event</span>
            </div>
            <div v-if="experienceLeft <= 0 && allLevelsFinishedIndicator" class="info">
                <!-- <span class="no-experience-left">Поздравляем, <br> ты прошел игру!</span> -->
                <span class="no-experience-left">Congratulations, <br> you finished the game!</span>
            </div>
        </div>
        <img src="@/assets/svg/experienceLeft/rightPeace.svg" alt="" class="peace right-peace">
    </div>
</template>

<style lang="scss" scoped>
.no-experience {
    .info {

        .no-experience-left {
            display: inline-block !important;
        }

        .experience-left {
            display: none !important;
        }
    }
}

.experience-container {
    position: fixed;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    transition: all .2s;

    @media only screen and (min-width: 850px) {
        top: 4rem;
    }

    .peace {
        position: absolute;
        top: 0;
        width: 7.75rem;
    }

    .left-peace {
        left: -10%;
    }

    .right-peace {
        right: -10%;
    }

    .info-container {
        @include flex-center;
        position: relative;
        width: 24rem;
        height: 5rem;
        z-index: 100;

        .main-rectangle {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
        }

        .info {
            @include flex-center;
            font-weight: 500;
            position: relative;
            z-index: 100;
            flex-direction: column;
            margin-bottom: .2rem;
            text-align: center;

            .subtitle {
                font-size: 1rem;
                opacity: .8;
                text-shadow: 0px 2px 4px #000000;
                display: inline-block;
                margin-top: .2rem;
            }

            .experience-left {
                text-shadow: 0px 2px 4px #000000;
            }

            .no-experience-left {
                @include yellowGradientText;
            }
        }
    }
}
</style>