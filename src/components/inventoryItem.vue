<script setup lang="ts">


const props = defineProps({
    src: String,
    amount: Number
});
    

</script>

<template>
    <div class="item">
        <img :src="props.src" alt="" class="item__image"/>
        <span class="item__amount">{{props.amount}}</span>
    </div>
</template>

<style lang="scss" scoped>
.item {
    position: relative;
    width: 85px;
    height: 85px;
    padding: 8px;
    background-image: url('@/assets/img/itemBorder.png');

    &__amount {
        position: absolute;
        width: 20px;
        height: 20px;
        text-align: center;
        top: -4px;
        right: -3px;
        border-radius: 100%;
        background: url("@/assets/img/itemAmountBG.png"), linear-gradient(180deg, #FFC701 0%, #E04F21 100%);
        background-blend-mode: soft-light, normal;
        @media (min-width: 850px) {
            width: 25px;
            height: 25px;
        }
    }

    &__image {
        width: 100%;
        height: 100%;
    }
}
</style>
