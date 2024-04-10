<script setup lang="ts">
import Modal from '@/components/modal.vue';
import Item from '@/components/inventoryItem.vue';

</script>

<template>
    <Modal>
        <div class="freebb">
            <img class="close" src="@/assets/svg/crossYellow.svg" alt="" />
            <Item />
            <!-- <h1 class="text">У вас 2 бесплатные ставки в BetBoom. Используйте их</h1> -->
            <h1 class="text">You have 2 free bets. Use them</h1>
            <button class="button base-button button-yellow" >Go to website</button>
        </div>
    </Modal>

</template>

<style lang="scss" scoped>
.freebb {
    display: flex;
    flex-flow: column;
    gap: 24px;
    align-items: center;
    position: relative;
    padding: 16px;

    background: url("@/assets/img/texture.png"), linear-gradient(180deg, #2C292E 0%, #191A1E 100%);
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.5);

    border: 2px solid;
    border-image: linear-gradient(180deg, #525257 -21.96%, rgba(47, 52, 56, 0) 55.53%) 20;
}
.close {
    position: absolute;
    top: 16px;
    right: 16px;
    cursor: pointer;
}
.text {
    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 24px;
}
</style>
