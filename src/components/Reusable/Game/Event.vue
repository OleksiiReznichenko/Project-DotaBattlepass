<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';
import { useEventsStore } from '@/stores/events';
import type Award from "@/interfaces/award";
import type Sprite from "@/interfaces/sprite";
import AwardComp from "@/components/Reusable/Game/Award.vue";
import TowerRadiant from "@/components/Reusable/Game/Events/TowerRadiant.vue";
import Runes from "@/components/Reusable/Game/Sprites/Runes.vue";
import OutworldDestroyer from "@/components/Reusable/Game/Sprites/OutworldDestroyer.vue";
import ChaosKnight from "@/components/Reusable/Game/Sprites/ChaosKnight.vue";
import ShadowFiend from "@/components/Reusable/Game/Sprites/ShadowFiend.vue";
import TowerDior from "@/components/Reusable/Game/Sprites/TowerDior.vue";

interface Props {
    index: number;
    name: string;
    icon: string;
    eventLeftPosition: number;
    userLevel: number;
    // awards: Award[];
    sprites: null | Sprite;
}

const props = defineProps<Props>();

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const eventsStore = useEventsStore();
const { fightEvents, prizesForLevels, allPrizes } = storeToRefs(eventsStore);

const currentEvent = computed(() => {
    return fightEvents.value.find(el => {
        return el.userLevel === user.value.level;
    })
});

const prevEvent = computed(() => {
    return fightEvents.value.find(el => {
        return el.userLevel === user.value.level - 1;
    })
});

// const awards = ref<any>([
//     {
//         description: "Fragstore 5%",
//         title: "Fragstore 5%",
//     },
//     {
//         description: "Fragstore 10%",
//         title: "Fragstore 10%",
//     },
//     {
//         description: "Fragstore 15%",
//         title: "Fragstore 15%",
//     }
// ])

// const awards = ref<any>([]);

const awards = computed(() => {
    if (!isRegistered.value || !prizesForLevels.value) return [];
    const prizesArrayStarter = prizesForLevels.value.find(el => {
        if (props.userLevel !== 24) {
            return el.levelId === props.userLevel;
        } else {
            return el.levelId === props.userLevel + 1;
        }
    });

    if (!prizesArrayStarter) return [];

    const prizes = prizesArrayStarter.levelPrizes.map(el => {
        return allPrizes.value.find(el2 => {
            return el2.id === el.id;
        })
    });

    const prizesFiltered = prizes?.filter(el => {
        const title = el?.title.toLowerCase();
        const description = el?.description.toLowerCase();
        return !title?.includes('mine') && !description?.includes('mine') &&
        !title?.includes('rune') && !description?.includes('rune');
    });

    return prizesFiltered;
});

// watchEffect(() => {
//     if (!isRegistered.value || !prizesForLevels.value) return [];
//     const prizesArrayStarter = prizesForLevels.value.find(el => {
//         // console.log(el.levelId, user.value.level)
//         return el.levelId === props.userLevel;
//     })

//     console.log('prizesArrayStarter', prizesArrayStarter)

//     if (!prizesArrayStarter) return [];

//     const prizes = prizesArrayStarter.levelPrizes.map(el => {
//         return allPrizes.value.find(el2 => {
//             return el2.id === el.id;
//         })
//     })

//     awards.value = prizes;
// })

const showAwards = computed(() => {
    if (props.userLevel > user.value.level && awards.value.length > 0) {
        return true;
    } else {
        return false;
    }
});

const showName = computed(() => {
    if (props.userLevel === user.value.level) {
        if (window.outerWidth > 850 || window.outerWidth <= 850 && window.outerHeight > 600) {
            return true;
        } else {
            return false;   
        }
    } else {
        return false;
    }
});

onMounted(() => {
    
})
</script>

<template>
    <div :class="icon.toLowerCase(), 'event-' + index, {'no-login': !isRegistered}" class="event">
        <!-- :style="{'left': eventLeftPosition + '%'}" -->
        <div v-if="showAwards" class="awards-container">
            <div class="background"></div>
            <img src="@/assets/svg/awardLine.svg" alt="" class="border-line">
            <div class="awards-content">
                <span class="subtitle">Get a reward</span>
                <div class="flex-container">
                    <AwardComp
                        class="award-short"
                        v-for="(award, index) in awards"
                        :key="index"
                        :title="award?.title"
                        :description="award?.description"
                        :points="award?.points"
                    />
                    <!-- <AwardComp
                        class="award-short"
                        v-for="(award, index) in awards"
                        :key="index"
                        :type="award.type"
                        :coupon-number="award.couponNumber"
                        :promocode-number="award.promocodeNumber"
                        :amount="award.amount"
                    /> -->
                </div>
            </div>
        </div>
        <div v-if="showName" class="title-container">
            <img :src="'/characterIcons/' + icon + '.png'" alt="" class="event-icon">
            <span class="title">{{name}}</span>
        </div>
        <div v-if="sprites" class="image-container">
            <div v-if="name === 'Rune'" class="event-image">
                <Runes 
                    :index="index"
                    :position="eventLeftPosition" 
                    :userId="isRegistered" 
                />
            </div>
            <div v-if="name === 'Outworld Destroyer'" class="event-image">
                <OutworldDestroyer 
                    :position="eventLeftPosition" 
                    :userId="isRegistered" 
                    :userLevel="user.level" 
                    :currentEvent="currentEvent" 
                    :prevEvent="prevEvent" 
                />
            </div>
            <div v-if="name === 'Chaos Knight'" class="event-image">
                <ChaosKnight 
                    :position="eventLeftPosition" 
                    :userId="isRegistered" 
                    :userLevel="user.level" 
                    :currentEvent="currentEvent" 
                    :prevEvent="prevEvent" 
                />
            </div>
            <div v-if="name === 'Shadow Fiend'" class="event-image">
                <ShadowFiend 
                    :position="eventLeftPosition" 
                    :userId="isRegistered" 
                    :userLevel="user.level" 
                    :currentEvent="currentEvent" 
                    :prevEvent="prevEvent" 
                />
            </div>
            <!-- <div v-if="name === 'Tower Dire'" class="event-image">
                <TowerDior 
                    :position="eventLeftPosition" 
                    :userId="isRegistered" 
                    :userLevel="user.level" 
                    :currentEvent="currentEvent" 
                />
            </div>
            <div v-if="name === 'Трон'" class="event-image">
                <TowerDior 
                    :position="eventLeftPosition" 
                    :userId="isRegistered" 
                    :userLevel="user.level" 
                    :currentEvent="currentEvent" 
                />
            </div> -->
            <img v-if="name !== 'Rune' && name !== 'Outworld Destroyer' && name !== 'Chaos Knight' && name !== 'Shadow Fiend'" :src="'/events/' + icon + '.png'" alt="" class="event-image">
            <!-- <img v-if="name !== 'Rune' && name !== 'Outworld Destroyer' && name !== 'Chaos Knight'" :src="'/events/' + icon + '.png'" alt="" class="event-image"> -->
            <!-- <img :src="'/events/' + icon + '.png'" alt="" class="event-image"> -->
        </div>
        <div v-else class="image-container">
            <TowerRadiant v-if="name === 'Tower Radiant'" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.event {
    position: absolute;
    bottom: 28vh;
    width: 50rem;
    height: 80vh;
    z-index: 400;

    @media only screen and (min-width: 1000px) {
        bottom: 13vh !important;
    }

    @media only screen and (min-height: 950px) {
        height: 760px;
    }

    @media only screen and (max-width: 850px) and (max-height: 750px) {
        height: 570px;
    }

    @media only screen and (max-width: 850px) and (min-height: 750px) {
        height: 610px;
    }

    @media only screen and (max-width: 850px) and (min-height: 870px) {
        height: 650px;
    }

    @media only screen and (max-width: 850px) and (min-height: 950px) {
        height: 700px;
    }

    .awards-container {
        position: absolute;
        top: 13%;
        left: 50%;
        transform: translateX(-50%) scale(.85);
        text-align: center;
        padding: 16px;

        @media only screen and (max-width: 850px) and (max-height: 650px) {
            top: 24%;
            transform: translateX(-50%) scale(.75);
        }

        @media only screen and (max-width: 850px) and (max-height: 600px) {
            top: 30%;
        }

        @media only screen and (max-width: 850px) and (max-height: 550px) {
            top: 34%;
        }

        @media only screen and (max-width: 500px) {
            transform: translateX(-50%) scale(.7);
        }

        @media only screen and (min-width: 850px) {
            top: 5%;
        }

        .background {
            @include textureBackground;
            background-repeat: no-repeat;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: .9;
        }

        .awards-content {
            position: relative;
            width: 100%;
            height: 100%;
            z-index: 100;
        }

        .border-line {
            width: 100%;
            position: absolute;
            top: 0;
            left: 0;
            z-index: 200;
        }

        .subtitle {
            text-align: center;
            display: inline-block;
            margin-bottom: 10px;
        }

        .flex-container {
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .title-container {
        position: absolute;
        top: 21%;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: .5rem;

        @media only screen and (min-width: 850px) {
            margin-bottom: .2rem;
        }

        @media only screen and (max-width: 850px) and (max-height: 700px) {
            top: 23%;
        }

        @media only screen and (max-width: 700px) and (max-height: 700px) {
            top: 25%;
        }

        @media only screen and (max-width: 700px) and (max-height: 650px) {
            top: 30%;
        }

        @media only screen and (max-width: 700px) and (max-height: 600px) {
            top: 32%;
        }

        @media only screen and (max-width: 700px) and (max-height: 550px) {
            top: 34%;
        }

        .title {
            text-shadow: 0px 2px 4px #000000;
        }
        
        .event-icon {
            margin-right: .5rem;
        }
    }

    .image-container {
        width: 100%;
        height: 100%;
    }

    .event-image {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) ;
    }
}

.tower_radiant {
    bottom: 25vh;

    .awards-container {

        @media only screen and (max-width: 850px) and (max-height: 650px) {
            top: 19%;
        }

        @media only screen and (max-width: 850px) and (max-height: 600px) {
            top: 25%;
        }

        @media only screen and (max-width: 850px) and (max-height: 550px) {
            top: 31%;
        }
        

        // @media only screen and (max-width: 850px) and (max-height: 650px) {
        //     top: 16%;
        // }
    }
}

.tower_dire {
    bottom: 23vh;

    .event-image {
        height: 68vh;
        bottom: -3vh;
        left: 45%;

        @media only screen and (min-width: 850px) {
            height: 74vh;
            bottom: -7vh;
        }
    }

    .awards-container {

        @media only screen and (max-width: 850px) and (max-height: 650px) {
            top: 19%;
        }

        @media only screen and (max-width: 850px) and (max-height: 600px) {
            top: 25%;
        }

        @media only screen and (max-width: 850px) and (max-height: 550px) {
            top: 30%;
        }
    }
}

.runes {

    .event-image {
        left: 35%;
        height: 21vh;
        bottom: 19vh;

        @media only screen and (min-width: 850px) {
            height: 25vh;
            bottom: 25vh;
        }

        @media only screen and (max-width: 850px) and (max-height: 650px) {
            left: 39%;
        }
    }
    
    .title-container {
        

        @media only screen and (max-width: 850px) and (max-height: 850px) {
            top: 39%;
        }

        @media only screen and (max-width: 850px) and (max-height: 600px) {
            top: 44%;
        }
    }
}

.outworld_devourer {

    .event-image {
        height: 80vh;
        left: 0%;

        @media only screen and (max-width: 850px) and (max-height: 560px) {
            left: 4%;
        }
    }
}

.chaos_knight {

    .event-image {
        height: 58vh;
        bottom: -2vh;
        left: 0%;

        @media only screen and (min-width: 850px) {
            height: 63vh;
            bottom: 0vh;
            left: 10%;
        }

        @media only screen and (max-width: 850px) and (max-height: 750px) {
            left: 8%;
        }

        @media only screen and (max-width: 850px) and (max-height: 650px) {
            left: 17%;
        }

        @media only screen and (max-width: 850px) and (max-height: 550px) {
            left: 21%;
        }
    }
}

.shadow_fiend {

    .event-image {
        height: 55vh;
        bottom: 4vh;
        left: -12%;

        @media only screen and (min-width: 850px) {
            height: 64vh;
            bottom: -1vh;
        }

        @media only screen and (max-width: 850px) and (max-height: 600px) {
            left: -6%;
        }

        @media only screen and (max-width: 850px) and (max-height: 540px) {
            left: -3%;
        }
    }
}

.ancient {
    bottom: 16rem;

    .event-image {
        height: 100vh;
        bottom: -20vh;

        @media only screen and (min-width: 850px) {
            height: 110vh;
            bottom: -24vh;
        }
    }
}

.event-1 {
    left: 2.75%;

    @media only screen and (min-width: 850px) {
        left: 2%;
    }
}

.event-2 {
    left: 7.8%;

    @media only screen and (min-width: 850px) {
        left: 7.5%;
    }
}

.event-3 {
    left: 13.45%;

    @media only screen and (min-width: 850px) {
        left: 13%;
    }
}

.event-4 {
    left: 19.4%;

    @media only screen and (min-width: 850px) {
        left: 19%;
    }
}

.event-5 {
    left: 31%;
}

.event-6 {
    left: 40%;
}

.event-7 {
    left: 53%;
}

.event-8 {
    left: 57%;
}

.event-9 {
    left: 61%;
}

.event-10 {
    left: 65%;
}

.event-11 {
    left: 69%;
}

.event-12 {
    left: 81%;
}

.event-13 {
    left: 93%;
}



.no-login.event-1 {
    left: 11%;

    @media only screen and (min-width: 850px) {
        left: 8%;
    }
}

.no-login.event-2 {
    left: 45%;
}

.no-login.event-3 {
    left: 80%;
}
</style>