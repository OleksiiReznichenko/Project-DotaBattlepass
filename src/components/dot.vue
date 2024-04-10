<script setup lang="ts">
import { computed, reactive } from '@vue/reactivity';
import { onMounted } from 'vue';

const props = defineProps({
    isActive: Boolean,
});

const colors = reactive({
    color1: '#FD3A3A',
    color2: '#A61930',
})

onMounted(() => {
    if(props.isActive) {
        colors.color1 = 'green';
        colors.color2 = 'green';
    }
})
</script>

<template>
    <div v-if="!props.isActive" class="dot-red"></div>
    <div v-if="props.isActive" class="dot-green"></div>
</template>

<style lang="scss" scoped>
.dot-red {
    width: 4px;
    height: 4px;
    background: red;
    border-radius: 50%;
}

.dot-green {
    width: 4px;
    height: 4px;
    background: linear-gradient(180deg, #35E03B 0%, #288F18 100%);
    border-radius: 50%;
}
</style>
