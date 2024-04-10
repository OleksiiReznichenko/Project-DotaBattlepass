<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';

import TileAnimation from '@/assets/js/tile-animation';

const baseStore = useBaseStore();
const { isAwardsWindowOpened, isRouletteWindowOpened, goToNextEvent, myCharacterAction } = storeToRefs(baseStore);

const importAll = (r) => {
  const arr = [];
  for (const key in r) {
      arr.push(key);
  }
  return arr;
}
const idleFrames = ref(null);
const deathFrames = ref(null);

const _idleAnimation = ref(null);
const _deathAnimation = ref(null);

const animationState = ref({
    state: 'stopped'
});
const queue = ref([]);
const canvas = ref(null);
let _currentAnimation = ref(null);
let _paused = ref(false);

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
    case "idle":
      _idleAnimation.value.play(1, infinite);
      return _idleAnimation.value;
    case "death":
      _deathAnimation.value.play(1567, infinite);
      return _deathAnimation.value;
    default:
      console.error("Unexpected animation name")
  }
}

onMounted(() => {
  _idleAnimation.value = new TileAnimation(canvas.value, 600, 600, idleFrames);
  _deathAnimation.value = new TileAnimation(canvas.value, 600, 600, deathFrames);

  _idleAnimation.value.setQueue(queue.value).setState(animationState);
  _deathAnimation.value.setQueue(queue.value).setState(animationState);
  
  play('idle', true)
  
  const handleQueue = () => {
    if (animationState.value.state === "stopped" && queue.value.length) {
      animationState.value.state = "playing";
      const animation = queue.value.shift();
      _currentAnimation.value = playNext(animation.name, animation.infinite);
    }
    requestAnimationFrame(handleQueue)
  }
  requestAnimationFrame(handleQueue)
})
</script>

<template>
  <!-- <div class="sprite-container"> -->
    <canvas ref="canvas" class="main-frame"></canvas>
  <!-- </div> -->
</template>

<style lang="scss" scoped>
.main-frame {
  position: absolute;
  bottom: 0;
  left: 5%;
  z-index: 10000;
}
</style>