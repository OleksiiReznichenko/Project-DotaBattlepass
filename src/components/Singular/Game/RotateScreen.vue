<script setup lang="ts">

</script>

<template>
    <div class="rotate-screen">
        <div class="content">
            <img src="@/assets/svg/rotatePhone.svg" alt="" class="phone">
            <!-- <p class="description">Пожалуйста, переверните <br> ваше устройство</p> -->
            <p class="description">Please, rotate <br> your device</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.rotate-screen {
    @include flex-center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: var(--app-height);
    z-index: 10000000;
    background: #15121E;
    display: none;

    @media only screen and (max-width: 1000px) and (max-height: 480px) and (min-width: 600px) {
        display: flex;
    }

    .content {
        text-align: center;

        .phone {
            width: 20rem;
        }

        .description {
            font-size: 2rem;
        }
    }
}
</style>