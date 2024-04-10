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
const idleFrames = importAll(import.meta.glob("@/assets/sprites/Faceless_void/Idle/*"));
const attackFrames = importAll(import.meta.glob("@/assets/sprites/Faceless_void/Attack/*"));
const walkFrames = importAll(import.meta.glob("@/assets/sprites/Faceless_void/Walk/*"));
const victoryFrames = importAll(import.meta.glob("@/assets/sprites/Faceless_void/Victory/*"));

const _idleAnimation = ref();
const _attackAnimation = ref();
const _walkAnimation = ref();
const _victoryAnimation = ref();

const animationState = ref({
    state: 'stopped'
});
const queue = ref([]);
const canvas = ref(null);
let _currentAnimation = ref(null);
let _paused = ref(false);

watchEffect(() => {
  if (myCharacterAction.value === 'walk') {
      play('walk', true);
      setTimeout(() => {
        myCharacterAction.value = 'idle';
        play('idle', true);
      }, 3100);
  }
});

const play = (name, infinite = false) => {
  if (_paused.value) {
    return;
  }
  queue.value.push({
    name,
    infinite,
  });
};

const setPaused = (v) => {
  _paused.value = !!v;
};

const stop = () => {
  if (_currentAnimation.value) {
    _currentAnimation.value.stopAnimation();
  }
  _paused.value = true;
};

const playNext = (name, infinite) => {
  switch (name) {
    case "idle":
      _idleAnimation.value.play(1533, infinite);
      return _idleAnimation.value;
    case "attack":
      _attackAnimation.value.play(1567, infinite);
      return _attackAnimation.value;
    case "walk":
      _walkAnimation.value.play(1000, infinite);
      return _walkAnimation.value;
    case "victory":
      _victoryAnimation.value.play(1000, infinite);
      return _victoryAnimation.value;
    default:
      console.error("Unexpected animation name")
  }
}

onMounted(() => {
  _idleAnimation.value = new TileAnimation(canvas.value, 600, 600, idleFrames);
  _attackAnimation.value = new TileAnimation(canvas.value, 600, 600, attackFrames);
  _walkAnimation.value = new TileAnimation(canvas.value, 600, 600, walkFrames);
  _victoryAnimation.value = new TileAnimation(canvas.value, 600, 600, victoryFrames);

  _idleAnimation.value.setQueue(queue.value).setState(animationState);
  _attackAnimation.value.setQueue(queue.value).setState(animationState);
  _walkAnimation.value.setQueue(queue.value).setState(animationState);
  _victoryAnimation.value.setQueue(queue.value).setState(animationState);
  
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