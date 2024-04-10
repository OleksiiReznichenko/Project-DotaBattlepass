<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';

const baseStore = useBaseStore();
const { isAwardsWindowOpened, isRouletteWindowOpened } = storeToRefs(baseStore);

const showAnimation = ref<boolean>(true);

watchEffect(() => {
    if (!isRouletteWindowOpened.value) {
        showAnimation.value = true;
    } else {
        setTimeout(() => {
            showAnimation.value = false;
        }, 300);
    }
})

onMounted(() => {
    let locationWidth = 4 * window.outerHeight;
    if (window.outerHeight < 550) {
        locationWidth = 2200;
    }
    document.body.addEventListener('scroll', () => {
        if (document.body.scrollLeft > locationWidth) {
            showAnimation.value = false;
        } else {
            showAnimation.value = true;
        }
    })
})
</script>

<template>
    <div :class="{'tower-animation': showAnimation}" class="tower-radiant">
        <img src="@/assets/img/TowerRadiant_tower.png" alt="" class="top-part">
        <img src="@/assets/img/TowerRadiant_platform.png" alt="" class="bottom-part">
    </div>
</template>

<style lang="scss" scoped>
.tower-animation {
    
    .top-part {
        animation: TowerAnimation 3s infinite;
    }
}

.tower-radiant {
    position: absolute;
    bottom: -2vh;
    left: 50%;
    transform: translateX(-50%);

    @media only screen and (max-width: 850px) {
        bottom: -6vh;
    }

    .top-part {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        
        height: 30vh;
        bottom: 18rem;
        transition: all .3s;

        @media only screen and (min-width: 850px) {
            height: 37vh;
            bottom: 11rem;
        }

        @media only screen and (min-height: 950px) {
            height: 350px;
        }

        @media only screen and (min-height: 950px) and (max-width: 850px) {
            height: 320px;
        }
    }

    .bottom-part {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        
        bottom: 9rem;
        width: 16rem;

        @media only screen and (min-width: 850px) {
            width: 17rem;
            bottom: 3rem;
        }
    }
}

@keyframes TowerAnimation {
    0% {
        transform: translateY(0) translateX(-50%);
    }
    50% {
        transform: translateY(-5vh) translateX(-50%);
    }
    100% {
        transform: translateY(0) translateX(-50%);
    }
}
</style>