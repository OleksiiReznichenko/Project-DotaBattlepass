<script setup lang="ts">

interface Props {
    leftPosition: string| undefined;
    icon: string| undefined;
    eventId: number| undefined;
    isFinished: boolean| undefined;
    totalXp: number| undefined;
}

const props = defineProps<Props>();
</script>

<template>
    <div :style="{'left': leftPosition}" :class="{'finished': isFinished}" class="event-circle" :data-id="eventId">
        <div class="central-circle">
            <img v-if="icon" :src="'/characterIcons/' + icon + '.png'" alt="Rune" class="event-icon">
        </div>
    </div>
</template>

<style lang="scss" scoped>

.event-circle,
.my-character {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 100%;
    background-color: var(--color-grey-2);
    cursor: pointer;
    z-index: 100;

    .central-circle {
        @include abs-center;
        @include flex-center;
        width: 1.8rem;
        height: 1.8rem;
        border-radius: 100%;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, .75);

        .event-icon {
            width: 1.4rem;
            height: 1.4rem;
        }
    }
}

.finished {
    .central-circle {
        border: 2px solid #FFAF00;
        box-shadow: 0px 0px 4px #FFB600;
    }
}

.active {
    border-radius: 0;
    background-image: url(@/assets/svg/activeEventItemProgressMap.svg);
    background-color: unset;
    background-size: 100%;
    background-repeat: no-repeat;
    width: 2.6rem;
    height: 2.2rem;
    
    .central-circle {
        width: 2.1rem;
        height: 1.9rem;
        border-radius: 0;
        background-image: url(@/assets/svg/activeFinishedEventItemProgressMap.svg);
        background-size: 100%;
        background-repeat: no-repeat;
        box-shadow: unset;
        left: 49%;

        .event-icon {
            margin-left: -.2rem;
        }
    }
}

.my-character {
    left: 30%;
}
</style>