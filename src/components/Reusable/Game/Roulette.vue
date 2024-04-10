<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue';
import { storeToRefs } from "pinia";
import { gsap, Power2 } from 'gsap';
import { useBaseStore } from '@/stores/index';
import { useAuthStore } from '@/stores/auth';
import { useRouletteStore } from '@/stores/roulette';
import { RouletteType } from '@/services/api/roulette';
import { useEventsStore } from '@/stores/events';

const baseStore = useBaseStore();
const { isRouletteWindowOpened, currentUserAction, rouletteGottenValue, skipScrollIndicator } = storeToRefs(baseStore);

const rouletteStore = useRouletteStore();
const { roulettes, winId } = storeToRefs(rouletteStore);

const eventsStore = useEventsStore();
const { allPrizes } = storeToRefs(eventsStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const roulette = ref<null | HTMLElement>(null);
const rouletteContainer = ref<null | HTMLElement>(null);

// const gsapAnim1 = ref<any>(null);
// const gsapAnim2 = ref<any>(null);
watchEffect(() => {

    if (!roulette.value || rouletteContainer.value?.classList.contains('button-background')) return;
    if (isRegistered.value && !winId.value && !skipScrollIndicator.value) {
        roulette.value!.style.transition = `all 40s linear`;
        roulette.value!.style.transform = `rotate(-10000deg)`;
    }
    
    if (skipScrollIndicator.value) {
        // setTimeout(() => {
            roulette.value!.style.transition = `none`;
        // }, 200);
        return;
    }
    if (!isRouletteWindowOpened.value) {
        setTimeout(() => {
            roulette.value!.style.transition = `none`;
            roulette.value!.style.transform = `rotate(0deg)`;
        }, 200);
        return;
    }
    if (isRouletteWindowOpened.value && winId || !isRegistered) {
        setTimeout(() => {
            roulette.value!.style.transition = `all 4s ease-out`;
            roulette.value!.style.transform = `rotate(${rouletteGottenValue.value.neededRotation}deg)`;
        }, 200);
    }
});

onMounted(() => {
    eventsStore.getAllPrizes();
})
</script>

<template>
    <div ref="rouletteContainer" class="roulette-container">
        <img src="@/assets/img/rouletteCap.png" alt="" class="roulette-cap">
        <div class="roulette">
            <div ref="roulette" class="inner-container">
                <img src="@/assets/img/roulette.png" alt="" :class="currentUserAction" class="roulette-image">
                <div v-if="(currentUserAction === 'attack' || currentUserAction === 'farm') && isRegistered && roulettes.filter(item => item.name === RouletteType.FARM)[0]?.roulette_options" class="roulette-values">
                    <span 
                        v-for="(item, index) in roulettes.filter(item => item.name === RouletteType.FARM)[0]?.roulette_options" 
                        class="value" :class="'value-'+ (index+1)">
                        {{allPrizes.filter(prize => prize.id === item.prizeId)[0]?.points}}
                    </span>
                </div>
                <div v-if="(currentUserAction === 'attack' || currentUserAction === 'farm') && !isRegistered" class="roulette-values">
                    <span class="value value-1">50</span>
                    <span class="value value-2">100</span>
                    <span class="value value-3 value-rare">150</span>
                    <span class="value value-4">100</span>
                    <span class="value value-5">50</span>
                    <span class="value value-6">100</span>
                    <span class="value value-7 value-rare">150</span>
                    <span class="value value-8">100</span>
                    <span class="value value-9">50</span>
                    <span class="value value-10">50</span>
                    <span class="value value-11 value-rare">200</span>
                    <span class="value value-12">50</span>
                </div>
                <div v-if="currentUserAction === 'getFreeSpins' && isRegistered && roulettes.filter(item => item.name === RouletteType.MINE)[0]?.roulette_options" class="roulette-values free-spins-values">
                    <span 
                        v-for="(item, index) in roulettes.filter(item => item.name === RouletteType.MINE)[0]?.roulette_options" 
                        class="value" :class="'value-'+ (index+1)">
                        {{allPrizes.filter(prize => prize.id === item.prizeId)[0]?.type.split(':')[2] || 1}}  
                    </span>
                </div>
                <div v-if="currentUserAction === 'getFreeSpins' && !isRegistered" class="roulette-values free-spins-values">
                    <span class="value value-1">1</span>
                    <span class="value value-2">2</span>
                    <span class="value value-3">1</span>
                    <span class="value value-4">2</span>
                    <span class="value value-5">1</span>
                    <span class="value value-6 value-rare">3</span>
                    <span class="value value-7">1</span>
                    <span class="value value-8">2</span>
                    <span class="value value-9">1</span>
                    <span class="value value-10">1</span>
                    <span class="value value-11 value-rare">3</span>
                    <span class="value value-12">2</span>
                </div>
                <div v-if="currentUserAction === 'getRunes' && isRegistered && roulettes.filter(item => item.name === RouletteType.RUNIC)[0]?.roulette_options" class="roulette-values runes-values">
                    <img 
                        v-for="(item, index) in roulettes.filter(item => item.name === RouletteType.RUNIC)[0]?.roulette_options" 
                        class="value" :class="'value-'+ (index+1)" :src="allPrizes.filter(prize => prize.id === item.prizeId)[0]?.image"/>
                </div>
                <div v-if="currentUserAction === 'getRunes' && !isRegistered" class="roulette-values runes-values">
                    <img src="/runes/RuneWater.png" alt="" class="value value-1">
                    <img src="/runes/RuneSorcery.png" alt="" class="value value-2">
                    <img src="/runes/RuneDoubleDamage.png" alt="" class="value value-3">
                    <img src="/runes/RuneWater.png" alt="" class="value value-4">
                    <img src="/runes/RuneSorcery.png" alt="" class="value value-5">
                    <img src="/runes/RuneSorcery.png" alt="" class="value value-6">
                    <img src="/runes/RuneWater.png" alt="" class="value value-7">
                    <img src="/runes/RuneHaste.png" alt="" class="value value-8">
                    <img src="/runes/RuneSorcery.png" alt="" class="value value-9">
                    <img src="/runes/RuneWater.png" alt="" class="value value-10">
                    <img src="/runes/RuneSorcery.png" alt="" class="value value-11">
                    <img src="/runes/RuneDoubleDamage.png" alt="" class="value value-12">
                </div>
                <div v-if="currentUserAction === 'attack'" class="center-sphere red-sphere"></div>
                <div v-if="currentUserAction === 'farm'" class="center-sphere orange-sphere"></div>
                <div v-if="currentUserAction === 'getRunes' || currentUserAction === 'getFreeSpins'" class="center-sphere purple-sphere"></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.roulette-container.button-background {
    bottom: -6rem !important;
    transform: translateX(-50%) scale(.95) !important;

    .roulette-cap,
    .center-sphere {
        display: none !important;
    }
}
.roulette-container {
    width: 20rem;
    height: 20rem;

    position: absolute;
    bottom: 25vh;
    left: 50%;
    transform: translateX(-50%) scale(1.6);

    @media only screen and (min-width: 850px) {
        bottom: 15vh;
    }

    @media only screen and (max-width: 850px) and (max-height: 650px) {
        transform: translateX(-50%) scale(1.4);
    }

    .roulette-cap {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        width: 50px;
        filter: brightness(60%);
    }

    .center-sphere {
        @include abs-center;
        z-index: 100;
        background-size: cover;
    }

    .red-sphere {
        width: 4rem;
        height: 4rem;
        background-image: url(@/assets/img/spheres/redSphere.png);
    }

    .orange-sphere {
        width: 4rem;
        height: 4rem;
        background-image: url(@/assets/img/spheres/yellowSphere.png);
    }

    .purple-sphere {
        width: 3.75rem;
        height: 3.75rem;
        background-image: url(@/assets/img/spheres/purpleSphere.png);
    }

    .roulette,
    .inner-container {
        position: absolute;
        top: 0;
        left: 0;
        filter: drop-shadow(0px 3.09677px 41.8065px rgba(0, 0, 0, 0.85));
        @include flex-center;
        width: 100%;
        height: 100%;

        .roulette-image {
            width: 110%;
            height: 110%;
            border-radius: 100%;
        }

        .roulette-image.getRunes,
        .roulette-image.getFreeSpins {
            filter: hue-rotate(260deg) !important;
        }
        
        .roulette-image.farm {
            filter: hue-rotate(20deg) !important;
        }
        
        .roulette-image.attack {
            filter: hue-rotate(340deg) !important;
        }
        
        .roulette-image.go {
            filter: hue-rotate(145deg) !important;
        }

        .roulette-values {
            @include abs-center;
            width: 100%;
            height: 100%;
            z-index: 100;

            .value {
                color: transparent;
                background-color: #C9DEE7;
                text-shadow: 0px 2px 2px rgba(#000000, 32%),
                0px -1px 1px rgba(#FFFFFF, 25%);
                -webkit-background-clip: text;
                -moz-background-clip: text;
                background-clip: text;

                font-weight: 500;
                font-size: 1.3rem;
                display: inline-block;
                width: 3.5rem;
                position: absolute;
                text-align: center
            }

            .value-rare {
                @include yellowGradientText;
                text-shadow: none;
            }

            .value-1 {
                top: 0.85rem;
                right: 5.95rem;
                transform: rotate(15deg);
            }

            .value-2 {
                top: 3.05rem;
                right: 2.1rem;
                transform: rotate(45deg);
            }

            .value-3 {
                top: 6.9rem;
                right: -.175rem;
                transform: rotate(75deg);
            }

            .value-4 {
                bottom: 7rem;
                right: -.15rem;
                transform: rotate(106deg);
            }

            .value-5 {
                bottom: 3.1rem;
                right: 2.1rem;
                transform: rotate(136deg);
            }

            .value-6 {
                bottom: .8rem;
                right: 6rem;
                transform: rotate(166deg);
            }

            .value-7 {
                bottom: .8rem;
                left: 5.95rem;
                transform: rotate(-166deg);
            }

            .value-8 {
                bottom: 3rem;
                left: 2.1rem;
                transform: rotate(-136deg);
            }

            .value-9 {
                bottom: 7rem;
                left: -.225rem;
                transform: rotate(-106deg);
            }

            .value-10 {
                top: 6.9rem;
                left: -.15rem;
                transform: rotate(-75deg);
            }

            .value-11 {
                top: 3.05rem;
                left: 2.05rem;
                transform: rotate(-45deg);
            }

            .value-12 {
                top: .75rem;
                left: 6rem;
                transform: rotate(-15deg);
            }
        }

        .runes-values {
            width: 107% !important;
            height: 107% !important;
            transform: translate(-50%, -50%) scale(.95) !important;

            @media only screen and (min-width: 850px) {
                width: 104% !important;
                height: 104% !important;
            }

            .value {
                width: 24px;
            }

            .value-1 {
                top: .7rem;
                right: 7.2rem;
            }

            .value-2 {
                top: 3.1rem;
                right: 3.1rem;
            }

            .value-3 {
                top: 7.1rem;
                right: .65rem;
            }

            .value-4 {
                bottom: 7.2rem;
                right: .8rem;
            }

            .value-5 {
                bottom: 3.2rem;
                right: 3rem;
            }

            .value-6 {
                bottom: .9rem;
                right: 7.2rem;
            }

            .value-7 {
                bottom: .9rem;
                left: 7.1rem;
            }

            .value-8 {
                bottom: 3.1rem;
                left: 2.9rem;
            }

            .value-9 {
                bottom: 7.3rem;
                left: .65rem;
            }

            .value-10 {
                top: 7rem;
                left: .65rem;
            }

            .value-11 {
                top: 3rem;
                left: 3rem;
            }
            
            .value-12 {
                top: .7rem;
                left: 7.2rem;
            }
        }
    }
}
</style>