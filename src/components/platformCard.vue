<script setup lang="ts">
import type { Quests } from '@/services/api/quests/index';
import type { PropType } from 'vue';
import type { Prize } from '@/services/api/user';


const props = defineProps({
    data: {
        type: Object as PropType<Quests>,
        required: true,
    },
    prize: {
        type: Object as PropType<Prize> | null,
    },
    isComplited: {
        type: Boolean,
        default: false,
    }
});

</script>

<template>
    <section class="cards">
        <div class="card" :style="props.isComplited ? 'text-decoration: line-through;' : 'text-decoration: none;'">
            <div class="card__header">
                <span class="card__name">{{props?.data?.name}}</span>
                <img class="card__arrow" src="@/assets/svg/arrowGreen.svg" alt="" />
            </div>
            <h1 class="card__mission" v-html="props?.data?.description"></h1>
            <div class="card__bottom" v-if="props.prize">
                <img class="card__prize-img" alt="" :src="props?.prize?.user_prize?.image"/>
                <span class="card__prize-title">Награда: {{props.prize?.user_prize.title}}</span>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    .cards {
        display: flex;
        gap: 16px;
        overflow-x: scroll;
        @media (min-width: 930px) {
            max-width: 260px;
        }
    }
    .card {
        position: relative;
        display: flex;
        flex-flow: column;
        flex: 1;
        margin-top: 16px;
        padding: 16px;
        background: url('@/assets/img/texture.png'), var(--gradient-grey);

        border-width: 2px;
        border-style: solid;
        border-image: linear-gradient(#3f3f43 0%, transparent 50%) 10;
        border-bottom: none;

        overflow: hidden;
        &__header {
            display: flex;
            justify-content: space-between;
        }
        &__name {
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 700;
            font-size: 19px;
            line-height: 20px;
        }
        &__arrow {
            cursor: pointer;
        }
        &__mission {
            margin: 20px 0;
            font-family: 'Gilroy';
            font-style: normal;
            font-weight: 500;
            font-size: 16px;
            line-height: 20px;

            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
        }
        &__bottom {
            display: flex;
            flex-flow: row;
            gap: 16px;
            margin-top: auto;
        }
        &__prize-img {
            width: 24px;
            height: 24px;
        }
    }
    .card__mission ::v-deep(.twitch_link) {
        color: #30c02d;
        border-bottom: 1px solid #30c02d;
        font-family: 'Gilroy';
        font-style: normal;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
    }
</style>
