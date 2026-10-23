<script setup>
import { ref, onMounted, onUnmounted, watchEffect, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';

import TileAnimation from '@/assets/js/tile-animation';

const baseStore = useBaseStore();
const { isAwardsWindowOpened, isRouletteWindowOpened, myCharacterPosition, myCharacterAction, creepAnimationIndicator } = storeToRefs(baseStore);

const importAll = (r) => Object.keys(r).sort().map(key => r[key]);
const walkFrames = importAll(import.meta.glob("@/assets/sprites/Creep_Range/Walk/*", { eager: true, as: 'url' }));
const deathFrames = importAll(import.meta.glob("@/assets/sprites/Creep_Range/Death/*", { eager: true, as: 'url' }));

const _walkAnimation = ref();
const _deathAnimation = ref();
const _attackAnimation = ref();

const animationState = ref({
    state: 'stopped'
});
const queue = ref([]);
const canvas = ref(null);
let _currentAnimation = ref(null);
let _paused = ref(false);

const basePosition = ref(0);
const mapWidth = ref(0);

const play = (name, infinite = false) => {
  if (_paused.value) {
    return;
  }
  queue.value.push({
    name,
    infinite,
  });
};

const stop = () => {
  if (_currentAnimation.value) {
    _currentAnimation.value.stopAnimation();
  }
};

const playNext = (name, infinite) => {
  switch (name) {
    case "walk":
      _walkAnimation.value.play(800, infinite);
      return _walkAnimation.value;
    case "death":
      _deathAnimation.value.play(1000, infinite);
      return _deathAnimation.value;
    default:
      console.error("Unexpected animation name")
  }
}

// These temporary farm sprites must not remain as frozen final frames.
// Restart and clean up their animation state on every demo farm cycle.
const isVisible = ref(false);
watch(creepAnimationIndicator, (active, _previous, onCleanup) => {
  queue.value.length = 0;
  stop();
  isVisible.value = active;
  if (!active) return;

  play('walk', true);
  const deathTimer = setTimeout(() => {
    play('death', false);
  }, 1500);
  const hideTimer = setTimeout(() => {
    isVisible.value = false;
    queue.value.length = 0;
    stop();
  }, 2600);

  onCleanup(() => {
    clearTimeout(deathTimer);
    clearTimeout(hideTimer);
  });
}, { immediate: true });

let queueFrame = 0;

onMounted(() => {
  _walkAnimation.value = new TileAnimation(canvas.value, 250, 250, walkFrames);
  _deathAnimation.value = new TileAnimation(canvas.value, 250, 250, deathFrames);

  _walkAnimation.value.setQueue(queue.value).setState(animationState);
  _deathAnimation.value.setQueue(queue.value).setState(animationState);
  
  const handleQueue = () => {
    if (animationState.value.state === "stopped" && queue.value.length) {
      animationState.value.state = "playing";
      const animation = queue.value.shift();
      _currentAnimation.value = playNext(animation.name, animation.infinite);
    }
    queueFrame = requestAnimationFrame(handleQueue)
  }
  queueFrame = requestAnimationFrame(handleQueue)
})

onUnmounted(() => {
  cancelAnimationFrame(queueFrame);
  _currentAnimation.value?.stopAnimation();
});
</script>

<template>
  <!-- <div class="sprite-container"> -->
    <canvas ref="canvas" v-show="isVisible" class="main-frame"></canvas>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.main-frame {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10000;
}
</style>