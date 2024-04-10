<script setup lang="ts">
import { watchEffect, onMounted, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useBaseStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useLevelsStore } from '@/stores/levels';
import { useRouter } from 'vue-router';

const baseStore = useBaseStore();
const { allLevelsFinishedIndicator, endLightLineIndicator, isAwardsWindowOpened } = storeToRefs(baseStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const levelsStore = useLevelsStore();
const { levels } = storeToRefs(levelsStore);

const router = useRouter();

let isLastLevelIndicator = ref<boolean>(false);

const closeIndicator = computed(() => {
    if (levels.value.length < 1 || isRegistered.value) return;
    const currentLevel = levels.value.find((el, i, arr) => {

        if (i + 1 === arr.length) {
            isLastLevelIndicator.value = true;
            return el.points;
        }
        if (el.points === 0 && user.value.points < arr[i + 1].points) {
            return el;
        }
        return user.value.points - arr[i + 1].points < 0
    })

    if (isLastLevelIndicator.value && user.value.points >= currentLevel!.points) {
        return true;
    } else {
        return false;
    }
})

const auth = (): void => {
    // authStore.login('RU', '21f5b1f2-60e7-4ac0-a7c5-74136735db56');
    window.parent.postMessage({ type: 'betboom_register' }, '*');
    userStore.getUserInfo();
    allLevelsFinishedIndicator.value = false;
    isAwardsWindowOpened.value = false;

    router.go(0);
}
</script>

<template>
    <div :class="{'closed': !closeIndicator}" class="registration-award-screen">
        <div class="background"></div>
        <div class="content">
            <!-- <h2 class="title">Новые награды ждут тебя!</h2> -->
            <h2 class="title">New rewards are waiting for you!</h2>
            <!-- <p class="description">Игровой ПК всего в двух шагах. Пройди регистрацию и сломай вражеский трон!</p> -->
            <p class="description">A gaming PC is just a step away. Register and destroy the enemy throne!</p>
            <div class="award">
                <div class="image-container">
                    <img src="/awardsBackgrounds/bonusPercentBackground.svg" alt="" class="award-background">
                    <!-- <img src="/awardsBackgrounds/bonusPercent.png" alt="" class="award-image"> -->
                    <img src="@/assets/dota.svg" alt="" class="award-image">
                    <img src="@/assets/img/light2.png" alt="" class="light">
                </div>
                <div class="award-info">
                    <strong class="award-title">Bonus 100%</strong>
                    <!-- <p class="award-description">На депозит в BetBoom</p> -->
                    <!-- <p class="award-description">On your deposit</p> -->
                </div>
            </div>
            <div class="buttons">
                <!-- <button @click="auth" class="btn btn-green">Регистрация</button> -->
                <button @click="auth" class="btn btn-green">Registration</button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.registration-award-screen.closed {

    .light {
        animation: none !important;
    }
}
.registration-award-screen {
    @include textureBackground;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100000;
    width: 100%;
    height: var(--app-height);
    padding: 3rem 1rem 0;
    text-align: center;
    transition: all .5s;

    @media only screen and (min-width: 850px) {
        padding: 0;
    }

    .background {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: var(--app-height);
        background-size: cover;
        background-repeat: no-repeat;

        // @media only screen and (min-width: 850px) {
        //     background-image: url(@/assets/img/regAwardScreenBackgroundDesktop.jpg);
        // }

        // @media only screen and (max-width: 850px) {
        //     background-image: url(@/assets/img/regAwardScreenBackgroundMobile.jpg);
        // }
    }

    .light {
        @include abs-center;
        width: 50rem;
        height: 40rem;
        animation: rotation 60s linear infinite alternate;
        transition: all .3s;
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

    .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        z-index: 100;

        @media only screen and (min-width: 850px) {
            justify-content: center;
        }

        .title {
            font-family: Reaver;
            font-size: 2.8rem;
            margin-bottom: 1rem;
            width: 25rem;
            position: relative;
            z-index: 100;

            @media only screen and (min-width: 850px) {
                font-size: 3.2rem;
            }
        }

        .description {
            width: 320px;
            font-size: 18px;
            letter-spacing: .5px;
            position: relative;
            z-index: 100;
        }

        .award {
            @include abs-center;
            top: 45%;
            text-align: center;

            @media only screen and (max-width: 850px) and (max-height: 620px) {
                top: 48%;
            }

            @media only screen and (max-width: 850px) and (max-height: 580px) {
                top: 51%;
            }

            @media only screen and (min-width: 850px) {
                position: static;
                transform: unset;
                margin-top: 2.5rem;
                margin-bottom: 2.5rem;
            }

            .image-container {
                position: relative;
                box-shadow: 0px 0px 50px -18px #408664;
                filter: drop-shadow(0px 0px 20px #3B6350);
                width: 140px;
                height: 140px;
                margin-bottom: 1rem;

                .award-background {
                    width: 100%;
                    height: 100%;
                    position: relative;
                    z-index: 100;
                }

                .award-image {
                    position: absolute;
                    bottom: 3px;
                    left: 50%;
                    transform: translateX(-50%);
                    // width: 125px;
                    // height: 125px;
                    width: 85px;
                    height: 85px;
                    z-index: 200;
                }
            }

            .award-info {
                font-size: 18px;
                position: relative;
                z-index: 100;

                .award-title {
                    display: inline-block;
                    margin-bottom: .75rem;
                }

                .award-description {
                    width: 120px;
                    text-align: center;
                    margin: 0 auto;
                }
            }
        }

        .buttons {
            position: absolute;
            bottom: calc(var(--app-height) / 9);
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            width: 90%;
            z-index: 100;

            @media only screen and (min-width: 450px) {
                width: 390px;
            }

            @media only screen and (min-width: 850px) {
                position: static;
                transform: unset;
                margin-top: 1.5rem;
                width: 350px;
            }

            .btn {
                width: 100%;
                padding: 16px 0;
                box-shadow: 4px 4px 8px 0 rgba(0, 0, 0, .5);
            }
        }
    }
}
</style>