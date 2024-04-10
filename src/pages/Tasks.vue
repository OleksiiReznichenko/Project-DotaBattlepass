<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from '@vue/runtime-core';
import PlatformCard from '@/components/platformCard.vue';
import { useQuestsStore } from '@/stores/quests';
import { QuestCategories } from '@/services/api/quests/index';
import { useUserStore } from '@/stores/user';
import { useRouletteStore } from "@/stores/roulette";
import { useAuthStore } from '@/stores/auth';
import { RouletteType } from '@/services/api/roulette';

const rouletteStore = useRouletteStore();
const { roulettes } = storeToRefs(rouletteStore);

const questsStore = useQuestsStore();
const { data, questsDaily, userQuests } = storeToRefs(questsStore);

const userStore = useUserStore();
const { prizes, luckMoney, userBaseInfo, steps, spinsAmount } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered: isRegistered, token } = storeToRefs(authStore);

const findPrizeImg = ((id: string | null) => {
    return prizes.value.filter(item => item.prizeId === id)[0];
})

const currentRouletteState = computed(() => {
    if (!isRegistered.value) {
        return spinsAmount.value;
    }
    let spins = roulettes.value.find((item) => {
        return item.name === RouletteType.FARM;
    })?.state?.spins;

    if (!spins || spins < 0) {
        spins = 0;
    }

    spinsAmount.value = spins;
    return spinsAmount.value;
});

const spinsText = ((value: number) => {
    if (value === 1)
        // return 'Ход';
        return 'Move';
    if (value > 1 && value < 5) 
        // return 'Хода';
        return 'Moves';
    
    // return 'Ходов';
    return 'Moves';
});

onMounted(() => {
    questsStore.getQuestList();
    rouletteStore.getRoullettes();
    getUpdateQuestsTime();
    userStore.getUserBaseInfo();

    questsStore.getDailyQuests();
});

watch(token, () => {
    questsStore.getQuestList();
    rouletteStore.getRoullettes();
    getUpdateQuestsTime();
    userStore.getUserBaseInfo();

    questsStore.getDailyQuests();
})

const stepsHeader = computed(() => {
    return roulettes.value.filter(item => item.name === RouletteType.FARM)[0]?.state?.spins;
})



const typedPrice = (price: number): void => {
    questsStore.setActiveSample(price);
};

const updateTime = ref('');
const getUpdateQuestsTime = () => {
    setInterval(() => {
        let currentDate = new Date();
        let endDate = new Date(data.value.endAt);
        
        let diff = (endDate.getTime() - currentDate.getTime()) ;
        let hours = Math.floor(diff / 1000 / 60 / 60 );
        diff -=hours * 1000 * 60 * 60;
        let minutes = Math.floor(diff / 1000 / 60);
        diff -= minutes * 1000 * 60;
        let seconds = Math.floor(diff/1000);

        updateTime.value = `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
    }, 1000)
};

const bet = () => {
    window.parent.postMessage({"module_id":"esport","action":"goTo","route":"esport"}, '*')
}

const register = () => {
    window.parent.postMessage({ type: 'betboom_register' }, '*');
}

const auth = (): void => {
    window.parent.postMessage({ type: 'betboom_register' }, '*');
    userStore.getUserInfo();
}

</script>

<template>
    <div class="tasks-page" >
        <header class="header">
            <div class="header--mobile">
                <span class="spin-amount"><span class="spin-amount__amount">{{currentRouletteState}}</span><span class="spin-amount__spin">{{spinsText(spinsAmount)}}</span></span>
                <img class="spin-img" src="@/assets/svg/doubleTrapezoid.svg" alt=""/>
            </div>
        </header>
        <section class="option">
            <div class="get-spin" v-if="isRegistered">
                <!-- <h1 class="get-spin__text">Следующий ход через</h1> -->
                <h1 class="get-spin__text">Next move in</h1>
                <span class="get-spin__time">{{updateTime}}</span>
            </div>
            <div class="or" v-if="isRegistered">
                <div class="or__line"></div>
                <span class="or__text">Or</span>
                <div class="or__line"></div>
            </div>
            <div class="make-deposit" v-if="isRegistered">
                <div class="make-deposit__header">
                    <!-- <img class="make-deposit__img" src="@/assets/svg/bbLogo24.svg" alt=""/> -->
                    <!-- <label class="make-deposit__title">Сделай ставку на киберспорт</label> -->
                    <label class="make-deposit__title">Place a bet on eSports</label>
                </div>
                <div class="make-deposit__main">
                    <div class="make-deposit__line"></div>
                    <div class="make-deposit__info">
                        <img class="make-deposit__info-img" src="@/assets/img/spineSteps.png" alt=""/>
                        <div class="make-deposit__info-text">
                            <span class="make-deposit__spine">Get {{steps}} {{spinsText(steps)}}</span>
                            <span class="make-deposit__price">{{luckMoney}} ₽</span>
                        </div>
                    </div>
                    <div class="make-deposit__line"></div>
                </div>
                <!-- <button class="make-deposit__button btn btn-green" @click="bet">Сделать Ставку</button> -->
                <button class="make-deposit__button btn btn-green" @click="bet">Place a Bet</button>
                <div class="make-deposit__line-bottom"></div>
            </div>
            <div class="reg" v-if="!isRegistered">
                <!-- <span class="reg__text">Зарегистрируйся, чтобы получать призы</span> -->
                <span class="reg__text">Register to receive prizes</span>
                <button class="reg__button base-button button-green" @click="auth">Registration</button>
            </div>
        </section>
        <section class="main" :style="isRegistered ? '' : 'filter:blur(6px)'">
            <!-- <h1 class="main__title">Выполни задания</h1> -->
            <h1 class="main__title">Complete the tasks</h1>
            <div class="time">
                <div class="time__header">
                    <!-- <img class="time__img" src="@/assets/svg/bbLogo32.svg" alt=""/> -->
                    <!-- <span class="time__title">Ежедневные задания BetBoom</span> -->
                    <span class="time__title">Daily tasks</span>
                </div>
                <span class="time__time">Before update: {{updateTime}}</span>
            </div>
            <!-- <div class="cards">
                <PlatformCard 
                    v-for="item in data.quests.filter(item => item.category===QuestCategories.BETBOOM)" 
                    :data="item" :key="item.id" 
                    :prize="findPrizeImg(item.prizeId)"
                    :isComplited="userQuests.filter(elem => elem.questId === item.id)[0]?.completed"
                    />
            </div> -->
            <div class="time">
                <div class="time__header">
                    <span class="time__title">Sosial tasks</span>
                </div>
                <span class="time__time">Before update: {{updateTime}}</span>
            </div>
            <div class="cards">
                <PlatformCard 
                    v-for="item in data.quests.filter(item => item.category===QuestCategories.SOCIALS)" 
                    :data="item" 
                    :key="item.id"
                    :isComplited="userQuests.filter(elem => elem.questId === item.id)[0]?.completed"
                    />
            </div>
            <div class="time">
                <div class="time__header">
                    <!-- <span class="time__title">Игровые задания DOTA 2</span> -->
                    <span class="time__title">Game tasks DOTA 2</span>
                </div>
                <span class="time__time">Before update: {{updateTime}}</span>
            </div>
            <div class="cards">
                <PlatformCard 
                    v-for="item in data.quests.filter(item => item.category===QuestCategories.GAMESDAILY)" 
                    :data="item" 
                    :key="item.id"
                    :isComplited="userQuests.filter(elem => elem.questId === item.id)[0]?.completed"
                    />
            </div>
            <div class="time">
                <div class="time__header">
                    <span class="time__title">Game tasks DOTA 2</span>
                </div>
                <span class="time__time">Not updated</span>
            </div>
            <div class="cards">
                <PlatformCard 
                    v-for="item in data.quests.filter(item => item.category===QuestCategories.GAMESOVERALL)" 
                    :data="item" 
                    :key="item.id"
                    :isComplited="userQuests.filter(elem => elem.questId === item.id)[0]?.completed"
                    />
            </div>
        </section>
    </div>
</template>

<style lang="scss" scoped>
    .tasks-page {
        overflow-y: scroll;
        margin: 0 auto;
        max-width: 912px;
        padding-bottom: 7rem;

        @media only screen and (min-width: 850px) {
            padding-top: 4rem;
            padding-bottom: 2rem;
        }
    }
    .header {
        &--mobile {
            position: relative;
            display: flex;
            justify-content: center;
        }
    }
    .option {
        padding: 0 16px;
    }
    .spin-amount {
        position: absolute;
        text-align: center;
        padding-top: 10px;
        text-shadow: 0px 2px 4px #000000;
        &__amount {
            font-family: Reaver;
            font-weight: 700;
            font-size: 20px;
            &::after {
                content: "\a";
                white-space: pre;
            }
        }
        &__spin {
            display: inline-block;
            font-family: "Gilroy";
            font-weight: 500;
            font-size: 10px;
            transform: translateY(-4px);
        }
    }
    .get-spin {
        text-align: center;
        display: flex;
        flex-flow: column;
        margin-top: 16px;
        &__text {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
            @media (min-width: 930px) {
                font-size: 20px;
            }
        }
        &__time {
            font-family: Reaver;
            font-style: normal;
            font-weight: 700;
            font-size: 48px;
            line-height: 48px;
            @media (min-width: 930px) {
                margin-top: 16px;
                font-size: 120px;
                line-height: 120px;
            }
        }
    }
    .or {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin-top: 16px;
        @media (min-width: 930px) {
            margin-top: 40px;
        }
        &__line {
            width: -webkit-fill-available;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
        }
        &__text {
            font-family: Reaver;
            font-weight: 700;
            font-size: 16px;
            line-height: 24px;
            @media (min-width: 930px) {
                font-size: 24px;
                line-height: 24px;
            }
        }
        
    }
    .make-deposit {
        display: flex;
        flex-flow: column;
        margin-top: 48px;
        justify-content: center;
        &__header {
            display: flex;
            justify-content: center;
        }
        &__title {
            margin-left: 16px;
            font-family: Reaver;
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 24px;
        }
        &__main {
            margin-top: 32px;
            display: flex;
            flex-flow: row;
            justify-content: center;
            gap: 50px;

        }
        &__line {
            border-left: 1px solid rgba(255, 255, 255, 0.2);
        }
        &__info {
            display: flex;
            flex-flow: row;
            gap: 22px;
        }
        &__info-img {
            width: 68px;
            height: 68px;
        }
        &__info-text {
            display: flex;
            flex-flow: column;
            gap: 8px;
        }
        &__price {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 700;
            font-size: 40px;
            line-height: 40px;
        }
        &__spine {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 19px;
        }
        &__button {
            width: 220px;
            margin: 32px auto 0;
            padding: 12px 0;
            filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.5));
            @media (max-width: 930px) {
                width: 100%;
            }
        }
        &__line-bottom {
            margin-top: 48px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            @media (max-width: 930px) {
                display: none;
            }
        }
    }
    .reg {
        display: flex;
        flex-flow: column;
        align-items: center;
        gap: 40px;
        @media (max-width: 930px) {
            gap: 16px
        }
        &__text {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 32px;
            line-height: 32px;
            @media (max-width: 930px) {
                font-size: 20px;
                text-align: center;
            }
        }
        &__button {
            width: 288px;
            font-family: 'Reaver';
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 32px;
        }
    }
    .main {
        padding: 40px 16px 0;
        &__title {
            font-family: 'Reaver';
            font-style: normal;
            font-weight: 600;
            font-size: 26px;
            line-height: 32px;
        }
    }
    .time {
        display: flex;
        justify-content: space-between;
        margin-top: 24px;
        padding-right: 16px;
        @media (max-width: 930px) {
            display: flex;
            flex-flow: column;
        }
        &__header {
            display: flex;
            flex-flow: row;
            gap: 16px;
            align-items: center;
            @media (max-width: 930px) {
                align-items: end;
            }
        }
        &__title {
            font-family: 'Reaver';
            font-style: normal;
            font-weight: 700;
            font-size: 22px;
            line-height: 24px;
        }
        &__time {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 24px;
        }
    }
    .cards {
        display: flex;
        flex-flow: column;
        width: 100%;
        gap: 16px;
        @media (min-width: 930px) {
            flex-flow: row wrap;
            min-width: 290px;
        }
    }
    .navigation {
        position: fixed;
        &--mobile {
            top: auto;
            bottom: 0;
        }
        &--desktop {
            top: 0;
        }
    }
</style>
