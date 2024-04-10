<script setup lang="ts">
import FAQVue from '@/pages/FAQ.vue';
import router from '@/router';
import { onMounted, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const hideNav = ref(false)
watchEffect(() => {
    if(route.path ==='/faq' || route.path === '/termsOfUse') {
        hideNav.value = true;
    }
    else {
        hideNav.value = false;
    } 
})
</script>

<template>
    <nav class="nav" :style="hideNav ? 'display:none' : ''">
        <div class="desktop posterior-part">
            <img src="@/assets/svg/nav/navLeftPosteriorPeaceDesktop.svg" alt="" class="left-peace-posterior">
            <img src="@/assets/svg/nav/navRightPosteriorPeaceDesktop.svg" alt="" class="right-peace-posterior">
            <img src="@/assets/svg/nav/navBackgroundDesktop.svg" alt="" class="background-posterior">
        </div>
        <div class="front-part">
            <img src="@/assets/svg/nav/navLineMobile.svg" alt="" class="mobile nav-line">
            <div class="desktop left-peace">
                <img src="@/assets/svg/nav/navLeftFrontPeaceDesktop.png" alt="" class="left-peace-img">
                <img src="@/assets/svg/nav/navLeftFrontPeaceLineDesktop.svg" alt="" class="left-peace-line">
            </div>
            <ul class="nav__list">
                <li class="nav__item">
                    <router-link to="/" :class="{'active': route.name === 'game'}" class="nav__link">
                        <!-- <span>Игра</span> -->
                        <span>Game</span>
                        <img src="@/assets/svg/nav/navItemDesktop.png" alt="" class="desktop background-desktop">
                        <img src="@/assets/svg/nav/navItemLineDesktop.svg" alt="" class="desktop line-desktop">
                        <img src="@/assets/svg/nav/navItemLineActiveDesktop.svg" alt="" class="desktop line-desktop-active">
                        <!-- <img src="@/assets/svg/nav/navItemMobile.png" alt="" class="mobile background-mobile">
                        <img src="@/assets/svg/nav/navItemLineMobile.svg" alt="" class="mobile line-mobile"> -->
                        <img src="@/assets/svg/nav/navItemLineActiveMobile.svg" alt="" class="mobile line-mobile-active">
                        <img src="@/assets/svg/nav/navItemActive.svg" alt="" class="background-active">
                        <img src="@/assets/svg/nav/navDivider.svg" alt="" class="mobile divider">
                    </router-link>
                </li>
                <li class="nav__item nav__item-middle">
                    <router-link to="/tasks" :class="{'active': route.name === 'tasks'}" class="nav__link">
                        <!-- <span>Задания</span> -->
                        <span>Tasks</span>
                        <img src="@/assets/svg/nav/navItemDesktop.png" alt="" class="desktop background-desktop">
                        <img src="@/assets/svg/nav/navItemLineDesktop.svg" alt="" class="desktop line-desktop">
                        <img src="@/assets/svg/nav/navItemLineActiveDesktop.svg" alt="" class="desktop line-desktop-active">
                        <!-- <img src="@/assets/svg/nav/navItemMobile.png" alt="" class="mobile background-mobile">
                        <img src="@/assets/svg/nav/navItemLineMobile.svg" alt="" class="mobile line-mobile"> -->
                        <img src="@/assets/svg/nav/navItemLineActiveMobile.svg" alt="" class="mobile line-mobile-active">
                        <img src="@/assets/svg/nav/navItemActive.svg" alt="" class="background-active">
                        <img src="@/assets/svg/nav/navDivider.svg" alt="" class="mobile divider">
                    </router-link>
                </li>
                <li class="nav__item">
                    <router-link to="/account" :class="{'active': route.name === 'account'}" class="nav__link">
                        <!-- <span>Аккаунт</span> -->
                        <span>Account</span>
                        <img src="@/assets/svg/nav/navItemDesktop.png" alt="" class="desktop background-desktop">
                        <img src="@/assets/svg/nav/navItemLineDesktop.svg" alt="" class="desktop line-desktop">
                        <img src="@/assets/svg/nav/navItemLineActiveDesktop.svg" alt="" class="desktop line-desktop-active">
                        <!-- <img src="@/assets/svg/nav/navItemMobile.png" alt="" class="mobile background-mobile">
                        <img src="@/assets/svg/nav/navItemLineMobile.svg" alt="" class="mobile line-mobile"> -->
                        <img src="@/assets/svg/nav/navItemLineActiveMobile.svg" alt="" class="mobile line-mobile-active">
                        <img src="@/assets/svg/nav/navItemActive.svg" alt="" class="background-active">
                    </router-link>
                </li>
            </ul>
            <div class="desktop right-peace">
                <img src="@/assets/svg/nav/navRightFrontPeaceDesktop.png" alt="" class="right-peace-img">
                <img src="@/assets/svg/nav/navRightFrontPeaceLineDesktop.svg" alt="" class="right-peace-line">
            </div>
        </div>

    </nav>
</template>

<style lang="scss" scoped>
.nav {
    position: fixed;
    bottom: -3px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10000;
    background-image: url(@/assets/img/texture.png), linear-gradient(180deg, #2C292E 0%, #191A1E 100%);
    width: 100%;
    display: flex;
    justify-content: center;

    @media only screen and (min-width: 850px) {
        bottom: auto;
        top: -.5rem;
        background-image: unset;
        width: unset;
        transform: translateX(-50%) scale(.85);
    }

    .posterior-part {
        position: absolute;
        top: -2px;
        left: 0;
        width: 100%;
        height: 5rem;

        .background-posterior {
            height: 4.75rem;
            width: 43rem;
            position: absolute;
            top: 0;
            left: 50%;
            transform: translateX(-50%);
        }

        .left-peace-posterior,
        .right-peace-posterior {
            height: 100%;
            width: 11rem;
            position: absolute;
            top: 0;
        }

        .left-peace-posterior {
            left: -3.75rem; 
        }

        .right-peace-posterior {
            right: -3.75rem;
        }
    }
    .front-part {
        position: relative;
        z-index: 100;
        display: flex;

        @media only screen and (max-width: 850px) {
            width: 100%;
        }
    }

    .nav-line {
        position: absolute;
        top: 0;
        width: 100%;
    }

    .left-peace,
    .right-peace {
        position: relative;
        height: 5rem;

        &-img,
        &-line {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
        }
    }

    .left-peace {
        width: 5rem;
        margin-right: -1.05rem;

        &-line {
            left: -.65rem;
        }
    }

    .right-peace {
        width: 4.5rem;
        margin-left: -1.05rem;

        &-line {
            right: -.65rem;
        }
    }
    
    .nav__list {
        display: flex;

        @media only screen and (max-width: 850px) {
            width: 100%;
            flex-grow: 1;
        }

        .nav__item {
            text-align: center;

            @media only screen and (max-width: 850px) {
                flex-grow: 1;
                width: 33%;
            }

            @media only screen and (max-width: 400px) {
                width: 31%;
            }

            &:not(:first-of-type) {
                margin-left: -1.45rem;

                @media only screen and (min-width: 850px) {
                    margin-left: -1.05rem;
                }
            }

            .nav__link {
                font-family: Reaver;
                font-size: 1.5rem;
                display: block;
                width: 13.5rem;
                height: 5rem;
                position: relative;
                overflow: hidden;
                @include flex-center;

                @media only screen and (max-width: 850px) {
                    width: 100%;
                    text-align: center;
                    overflow: visible;
                }

                .background-mobile,
                .background-desktop,
                .line-mobile,
                .line-desktop,
                .line-desktop-active {
                    @include abs-center;
                    width: 100%;
                    height: 100%;
                }

                .background-active {
                    @include abs-center;
                    width: 110%;
                    display: none;
                }

                .line-mobile-active {
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 7.2rem;
                }

                .line-mobile-active,
                .line-desktop-active {
                    display: none;
                    z-index: 100;
                }

                .divider {
                    position: absolute;
                    right: 0;
                    height: 100%;
                    z-index: 200;
                }
                
                span {
                    position: relative;
                    z-index: 100;
                }
            }

            .active {
                .line-desktop {
                    display: none;
                }

                .background-active,
                .line-mobile-active,
                .line-desktop-active {
                    display: block;
                }
            }
        }

        .nav__item-middle {

            @media only screen and (max-width: 400px) {
                width: 38%;
            }
        }
    }
}
</style>