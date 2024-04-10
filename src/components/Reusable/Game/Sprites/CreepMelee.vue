<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';

import TileAnimation from '@/assets/js/tile-animation';

const baseStore = useBaseStore();
const { isAwardsWindowOpened, isRouletteWindowOpened, myCharacterPosition, myCharacterAction, creepAnimationIndicator } = storeToRefs(baseStore);

const importAll = (r) => {
  const arr = [];
  for (const key in r) {
      arr.push(key);
  }
  return arr;
}
const walkFrames = importAll(import.meta.glob("@/assets/sprites/Creep_Melee/Walk/*"));
const deathFrames = importAll(import.meta.glob("@/assets/sprites/Creep_Melee/Death/*"));
const attackFrames = importAll(import.meta.glob("@/assets/sprites/Creep_Melee/Attack/*"));

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
    case "attack":
      _attackAnimation.value.play(1200, infinite);
      return _attackAnimation.value;
    default:
      console.error("Unexpected animation name")
  }
}

let deathTimeout = ref(null);
watchEffect(() => {
  if (creepAnimationIndicator.value) {
    play('walk', true);
    deathTimeout.value = setTimeout(() => {
      deathTimeout.value = null;
      play('death', false);
    }, 2200);
  } else {
    stop();
  }
});

onMounted(() => {
  _walkAnimation.value = new TileAnimation(canvas.value, 250, 250, walkFrames);
  _deathAnimation.value = new TileAnimation(canvas.value, 250, 250, deathFrames);
  _attackAnimation.value = new TileAnimation(canvas.value, 250, 250, attackFrames);

  _walkAnimation.value.setQueue(queue.value).setState(animationState);
  _deathAnimation.value.setQueue(queue.value).setState(animationState);
  _attackAnimation.value.setQueue(queue.value).setState(animationState);

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
  left: 0;
  z-index: 10000;
}
</style>