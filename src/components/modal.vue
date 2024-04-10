<script setup lang="ts">
    
    
</script>

<template>
    <div class="modal">
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>

.modal {
    position: absolute;

    z-index: 100;

    height: 100%;
    width: 100%;

    background: linear-gradient(180deg, rgba(10, 11, 35, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%);
    backdrop-filter: blur(6px);

    animation-name: modalAppearence;
    animation-duration: 0.2s;
}

@keyframes modalAppearence {
    from { opacity: 0 }
    to { opacity: 1}
}

.content {
    position: fixed;
    top: 50vh;
    left: 50%;
    transform: translate(-50%,-50%);
    @media (max-width: 930px) {
        width: 90%;
    }
}
</style>
    