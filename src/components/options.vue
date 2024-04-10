<script setup lang="ts">
    const mobile: boolean = true;

</script>

<template>
        <div class="mobile" v-if="mobile">
            <button class="button"><p class="text">Game</p></button>
            <button class="button"><p class="text">Tasks</p></button>
            <button class="button"><p class="text">Account</p></button>
        </div>
    <div class="desktop" v-if="!mobile">
        <div class="dark-back"></div>
        <button class="button"><p class="text">Game</p></button>
        <button class="button"><p class="text">Tasks</p></button>
        <button class="button"><p class="text">Account</p></button>
    </div>
</template>

<style lang="scss" scoped>


.mobile {
    display: flex;
    width: 100%;
    background: linear-gradient(180deg, #2C292E 0%, #191A1E 100%);;
    padding-left: 8px;
    .button {
        padding: 12px 7px;
        width: inherit;
        border: 3px solid transparent;
        transform: skewX(-12deg);
        border-radius: 3px;
        border-image: linear-gradient(145.66deg, #525257 -7.34%, rgba(47, 52, 56, 0) 90.21%) 10;
        transition: 0.3s;
        &:hover {
            background: radial-gradient(42.92% 44.54% at 53.82% 47.01%, rgba(254, 129, 55, 0.3) 0%, rgba(254, 128, 54, 0.15) 42%, rgba(254, 128, 54, 0.04) 79%, rgba(254, 128, 54, 0) 100%);
        }
    }
    .text {
        transform: skewX(12deg);
    }
}


.desktop {
    position: relative;
    display: flex;
    justify-content: center;
    gap: 5px;
    .button {
        background: linear-gradient(180deg, #2C292E 0%, #191A1E 100%);
        padding: 20px 42px 18px;
        border: 2px solid transparent;
        border-left-width: 0px;
        border-top-width: 0px;
        transform: skewX(-12deg);
        border-radius: 3px;
        border-image: linear-gradient(145.66deg, #525257 -7.34%, rgba(47, 52, 56, 0) 90.21%) 25;
        transition: 0.3s;

        font-family: Reaver;
        font-style: normal;
        font-weight: 700;
        font-size: 20px;
        line-height: 16px;
        &:hover {
            background: radial-gradient(42.92% 44.54% at 53.82% 47.01%, rgba(254, 129, 55, 0.3) 0%, rgba(254, 128, 54, 0.15) 42%, rgba(254, 128, 54, 0.04) 79%, rgba(254, 128, 54, 0) 100%);
        }
    }
    .dark-back {
        position: absolute;
        width: 470px;
        height: 48px;
        background: linear-gradient(0deg, rgba(44, 41, 46, 0) -63.36%, rgba(42, 39, 44, 0.022) -59.86%, rgba(19, 18, 20, 0.3869) -1.78%, rgba(5, 5, 5, 0.7227) 51.68%, #000000 95.82%);;
    }
}
</style>
