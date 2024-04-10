<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, watch, watchEffect } from '@vue/runtime-core';
import AwardComp from "@/components/Reusable/Game/Award.vue";

import { useUserStore } from '@/stores/user'
import Active from '@/components/active.vue';
import Item from '@/components/inventoryItem.vue';
import { PlatformNames } from '@/services/api/user/index';
import { useAuthStore } from '@/stores/auth';
import { useEventsStore } from '@/stores/events';

enum ShowPrizeTypes {
    COMMON = 'common',
    LOTTERY = 'lottery'
};

const userStore = useUserStore();
const { prizes, accounts, userInfo, user } = storeToRefs(userStore);

const eventsStore = useEventsStore();
const { allPrizes } = storeToRefs(eventsStore);

const authStore = useAuthStore();
const { isRegistered: isRegistered, token } = storeToRefs(authStore);

const connectPlatform = (name: PlatformNames) => {
    let win: Window | null;
    if(name === PlatformNames.DOTA2) {
        win = window.open("https://id.mymap.online/api/auth/steam?app=dotaboom",'dota2',
        'height=560,width=320,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no ,modal=yes');
    }
    if(name === PlatformNames.TWITCH) { 
        win = window.open("https://id.mymap.online/api/auth/twitch?app=dotaboom",'dota2',
        'height=560,width=320,toolbar=no,directories=no,status=no,menubar=no,scrollbars=no,resizable=no ,modal=yes');
    }  
    

    var timer = setInterval(function() { 
    if(win && win.closed) {
        clearInterval(timer);
        userStore.getUserAccountsInfo();
    }
}, 1000);
}

const connectPlatformMobile = (name: PlatformNames) => {
    if (name === PlatformNames.TWITCH) {
        window.parent.location.href = 'https://id.mymap.online/api/auth/twitch?app=dotaboom'
    } else {
        window.parent.location.href = 'https://id.mymap.online/api/auth/steam?app=dotaboom'
    }
}

const betboomAuth = () => {
    window.parent.postMessage({ type: 'betboom_auth' }, '*');
}

onMounted(() => {
    userStore.getPrizes();
    userStore.getUserAccountsInfo();
});

watch(token, () => {
    userStore.getPrizes();
    userStore.getUserAccountsInfo();
})

</script>

<template>
    <div class="account-page">
        <div class="layer">
            <div class="layer__first"></div>
            <div class="layer__second"></div>
            <!-- <div class="layer__third"></div> -->
        </div>
        <header class="header">
            <div class="header__map"></div>
            <img class="header__avatar-back" src="@/assets/img/profileImgOn.png" alt=""/>
            <img class="header__avatar" src="@/assets/myCharacter.gif" alt="" />
            <div class="header__line"></div>
            <div class="header__level">
                <span class="header__level-number">{{user.level}}</span>
            </div>
        </header>
        <section class="main">
            <div class="account">
                <span class="account__nickname">{{ userInfo.username }}</span>
                <span class="account__level">Level {{user.level}}</span>
            </div>
            <div class="inventory">
                <!-- <h1 class="inventory__title" v-if="isRegistered">Призы</h1> -->
                <div class="inventory__reg" v-if="!isRegistered">
                    <!-- <span class="inventory__reg-text">Зарегистрируйся, чтобы получать призы</span> -->
                    <span class="inventory__reg-text">Register to receive prizes</span>
                    <button class="inventory__button base-button button-green" @click="">Registration</button>
                </div>
                <!-- <div class="inventory__list" :style="isRegistered ? '' : 'filter:blur(6px)'">
                    <Item 
                        class="inventory__item" 
                        v-for="item in prizes
                        .filter(item => 
                        item.user_prize.type === ShowPrizeTypes.COMMON || 
                        item.user_prize.type === ShowPrizeTypes.LOTTERY ||
                        item.user_prize.title.includes('Fragstore'))" 
                        :key="item.id" 
                        :src="item.user_prize.image"
                        :amount="item.amount"
                    />
                </div> -->
            </div>
            <!-- <div v-if="isRegistered" class="sites">
                <div class="sites__item" v-for="item in accounts">
                    <div>
                        <div>
                            <h1 class="sites__name" >{{item.name}}</h1>
                            <Active class="sites__active" :isActive="item.username ? true : false" />
                        </div>
                        <button 
                            v-if="!item.username"
                            class="sites__button sites__button--desktop btn btn-green"
                            @click="connectPlatform(item.name)">
                            Подключить аккаунт
                        </button>
                        <a  v-if="!item.username" class="sites__button sites__button--mobile btn btn-green"
                            @click="connectPlatformMobile(item.name)"
                        >
                        Подключить аккаунт
                        </a>
                    </div>
                </div>
            </div> -->
            <!-- <div class="options">
                <img class="options__line" src="@/assets/svg/infoDivider.svg" alt="" />
                <router-link to="/faq" class="options__nav">
                    <img class="options__img" src="@/assets/svg/faq.svg" alt=""/>
                    <span class="options-mobile__text">FAQ</span>
                </router-link>
                <a href="https://static.betboom.ru/d3ac4eb90a9ed4d1e09e30ae44d7f016/documents/dotaboom_87959ad892fc9f5d9c5443147012dd48.pdf" class="options__nav" target="_blank">
                    <img class="options__img" src="@/assets/svg/userAggrement.svg" alt=""/>
                    <span class="options__text">Правила акции</span>
                </a>
                <img class="options__line options__line--bottom" src="@/assets/svg/infoDivider.svg" alt="" />
            </div> -->
            <!-- <div class="rules">
                <h1 class="rules__title">Условия розыгрыша</h1>
                <span class="rules__disc rules__disc-1">
                    Розыгрыш пройдёт на специальной трансляции, организованной BetBoom <br> по завершению акции (после 30.10.2022).
                </span>
                <span class="rules__disc rules__disc-2">
                    Для участия тебе понадобятся купоны, которые ты получишь при достижении нового уровня. Чем больше купонов, тем выше шанс получить приз 
                </span>
                <div class="rules__achives">
                    <div class="rules__achieve">
                        <AwardComp
                            class="award-short"
                            type="coupon"
                            :coupon-number="1"
                            :amount="1"
                        />
                        <div class="rules__right">
                            <span class="rules__level">Выдаётся при достижении 2-4 уровня:</span>
                            <span class="rules__text">Разыгрывается 100 фрибетов на 5000 рублей <br> 100 сертификатов Fragstore.ru на 1000 рублей каждый</span>
                        </div>
                    </div>
                    <div class="rules__achieve">
                        <AwardComp
                            class="award-short"
                            type="coupon"
                            :coupon-number="2"
                            :amount="1"
                        />
                        <div class="rules__right">
                            <span class="rules__level">Выдаётся при достижении 5-8 уровня: </span>
                            <span class="rules__text">Разыгрывается 100 фрибетов на 10 000 рублей <br> 100 сертификатов Fragstore.ru номиналом 3000 рублей</span>
                        </div>
                    </div>
                    <div class="rules__achieve">
                        <AwardComp
                            class="award-short"
                            type="coupon"
                            :coupon-number="3"
                            :amount="1"
                        />
                        <div class="rules__right">
                            <span class="rules__level">Выдаётся при достижении 9-15 уровня: </span>
                            <span class="rules__text">Разыгрывается 50 фрибетов на 20 000 рублей <br> 50 Сертификатов на 5000 рублей в магазине Fragstore.ru</span>
                        </div>
                    </div>
                    <div class="rules__achieve">
                        <AwardComp
                            class="award-short"
                            type="coupon"
                            :coupon-number="4"
                            :amount="1"
                        />
                        <div class="rules__right">
                            <span class="rules__level">Выдаётся при достижении 16-24 уровня: </span>
                            <span class="rules__text">Разыгрывается 10 фрибетов на 50 000 рублей <br> 20 сертификатов на 10 000 рублей в магазине Fragstore.ru</span>
                        </div>
                    </div>
                    <div class="rules__achieve">
                        <AwardComp
                            class="award-short"
                            type="coupon"
                            :coupon-number="5"
                            :amount="1"
                        />
                        <div class="rules__right">
                            <span class="rules__level">Выдаётся при достижении 25 уровня (прохождение игры): </span>
                            <span class="rules__text"> Разыгрывается Мечта Профессионального Игрока: полностью оснастим твоё игровое место для киберспорта: компьютер, монитор, наушники, мышь, клавиатура, игровое кресло и стол</span>
                        </div>
                    </div>
                </div>
            </div> -->
        </section>
    </div>
</template>

<style lang="scss" scoped>
.account-page {
    overflow: hidden;
    height: 100dvh;
    margin: 0 auto;
    max-width: 816px;
    padding-bottom: 8rem;

    @media only screen and (min-width: 850px) {
        padding-bottom: 0;
    }

    @media (min-width: 930px) {
        max-width: none;
    }
}
.layer {
    display: none;
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 100%;
    @media (min-width: 930px) {
        display: block;
    }
    &:before {
        content: "";
        display: block;
    }
    & div {
        background-size: cover;
        background-repeat: no-repeat;
        &:before {
            content: "";
            display: block;
        }
    }
    &__first {
        position: absolute;
        background: url('@/assets/img/accountMapFirst.png');
        width: 100%;
        height: 100%;
    }
    &__second {
        position: relative;
        background: url('@/assets/img/accountBackground.png');
        // height: 55%;
        height: 100%;
        z-index: 10;
    }
    &__third {
        position: relative;
        // height: 50%;
        height: 100%;
        transform: translateY(calc(-100% + 26px));
        z-index: 50;
    }
}
.header {
    position: relative;
    height: 194px;
    z-index: 201;

    @media only screen and (min-width: 850px) {
        // margin-top: 3rem;
        margin-top: 6rem;
    }
    &__map {
        height: 190px;
        background: url('@/assets/img/accountBackground.png');
        background-repeat: no-repeat;
        background-size: cover;
        @media (min-width: 930px) {
            display: none;
        }
    }
    &__avatar-back {
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
    }
    &__avatar {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        width: 78px;
        height: 120px;
        object-fit: cover;
    }
    &__line {
        position: absolute;
        bottom: 2px;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(90deg, #0F0F11 0%, #49494E 56.04%, #1E1F23 100%);
        @media (min-width: 930px) {
            display: none;
        }
    }
    &__level {
        display: flex;
        justify-content: center;
        align-items: center;
        background: radial-gradient(#2C292E 65%, transparent 70%), conic-gradient(transparent 0deg  220deg, #2C292E 220deg 360deg), linear-gradient(180deg, #FFC701 0%, #E04F21 100%);
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 32px;
        height: 32px;
        text-align: center;
        border-radius: 50%;
        transform: translateX(-50%);
    }
    &__level-number {
        font-family: 'Gilroy';
        font-style: normal;
        font-weight: 500;
        font-size: 20px;

        text-shadow: 0px 0px 5.51351px rgba(192, 144, 21, 0.8);

        background: linear-gradient(180deg, #FFC701 0%, #E04F21 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        -text-fill-color: transparent;
    }
}
.main {
    margin-top: 30px;
    padding: 0 16px;
    position: relative;
    z-index: 200;
    height: 100vh;

    @media (min-width: 930px)  {
        // height: fit-content;
        margin: -4px auto 0;
        max-width: 816px;
        // padding: 32px 104px;
        padding: 40px 104px;
        background: url('@/assets/img/texture.png'),linear-gradient(180deg, #2C292E 30%, #191A1E 100%); 
    }
    .account {
        text-align: center;
        display: flex;
        flex-flow: column;
        &__nickname {
            font-family: Reaver;
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 26px;
            text-align: center;
        }
        &__level {
            margin-top: 8px;
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 19px;
            text-align: center;
            background-image: linear-gradient(180deg, #FFC701 0%, #E04F21 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            -moz-background-clip: text;
            -moz-text-fill-color: transparent;
        }
    }

    .inventory {
        height: fit-content;
        margin-top: 20px;
        &__title {
            font-family: Reaver;
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 24px;
        }
        &__reg {
            display: flex;
            flex-flow: column;
            align-items: center;
            gap: 40px;
        }
        &__reg-tex {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 32px;
            line-height: 32px;
        }
        &__button {
            width: 288px;
            font-family: 'Reaver';
            font-style: normal;
            font-weight: 600;
            font-size: 16px;
            line-height: 32px;
        }
        &__list {
            margin-top: 26px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            justify-items: center;
            justify-content: center;
            align-items: center;
            align-content: center;
            grid-gap: 14px 0;

            @media (max-width: 700px) {
                grid-template-columns: repeat(5, 1fr);
            }

            @media (max-width: 500px) {
                grid-template-columns: repeat(4, 1fr);
            }

            @media (max-width: 400px) {
                grid-template-columns: repeat(3, 1fr);
            }
        }
    }

    .sites {
        flex-shrink: 0;
        &__item {
            margin-top: 32px;
            display: flex;
            flex-flow: column;
            @media (min-width: 930px) {
                display: flex;
                flex-flow: row;
                justify-content: space-between;
                align-items: baseline;
            }
        }
        &__name {
            font-family: Reaver;
            font-style: normal;
            font-weight: 700;
            font-size: 24px;
            line-height: 24px;
        }
        &__active {
            margin-top: 4px;
        }
        &__button {
            padding: 8px 0;
            width: 100%;
            margin-top: 16px;
            @media (min-width: 930px) {
                width: 288px;
                filter: drop-shadow(4px 4px 8px rgba(0, 0, 0, 0.5));
            }
            &--desktop {
                display: none;
                @media (min-width: 850px) {
                    display: block;
                }
            }
            &--mobile {
                display: none;
                @media (max-width: 850px) {
                    display: block;
                }
            }
        }
        
    }

    .actions {
        display: none;
        margin-top: 25px;
        @media (min-width: 930px) {
            display: block;
        }
        &__line {
            margin-left: -104px;
        }
        &__action {
            display: flex;
            flex-flow: column;
            gap: 20px;
            margin-top: 26px;
        }
        &__item {
            cursor: pointer;
            display: flex;
            gap: 10px;
        }
    }
    .options {
        margin-top: 40px;
        @media (min-width: 930px) {
            padding-bottom: 0;
        }
        &__line {
            width: calc(100% + 32px);
            margin-left: -16px;

            &--bottom {
                margin-top: 33px;
            }
            @media (min-width: 450px) {
                transform: scaleY(0.4);
            }
            @media (min-width: 930px) {
                padding-bottom: 0;
                width: calc(100% + 208px);
                margin-left: -104px;
            }
        }
        &__nav {
            display: flex;
            align-items: center;
            margin-top: 24px; 
            cursor: pointer;

            span {
                transition: all .3s;
            }

            &:hover {
                span {
                    opacity: .8;
                }
            }
        }
        &__img {
            margin-right: 10px;
        }
    }
    .rules {
        margin-top: 33px;
        &__title {
            font-family: 'Reaver';
            font-style: normal;
            font-weight: 600;
            font-size: 26px;
            line-height: 32px;
        }
        &__disc {
            display: block;
            margin-top: 24px;

            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;
        }
        &__achives {
            margin-top: 42px;
            display: flex;
            flex-flow: column;
            gap: 30px;
            @media (min-width: 930px) {
                gap: 8px;
            }
        }
        &__achieve {
            display: flex;
            flex-flow: row;
            gap: 16px;
        }
        &__img {
            width: 80px;
            height: 80px;
        }
        &__right {
            display: flex;
            flex-flow: column;
            font-family: 'Gilroy';
            font-style: normal;
            font-size: 16px;
            line-height: 20px;
        }
        &__level {
            font-weight: 700;
        }
        &__text {
            font-weight: 500;
        }
    }
}
</style>
