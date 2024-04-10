<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';
import { useUserStore } from '@/stores/user';
import { useAuthStore } from '@/stores/auth';

import TileAnimation from '@/assets/js/tile-animation';

const baseStore = useBaseStore();
const { isAwardsWindowOpened, isRouletteWindowOpened, myCharacterPosition, 
  myCharacterAction, currentUserAction, creepAnimationIndicator, eventAction, awardsClosedIndicator } = storeToRefs(baseStore);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

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

const setPaused = (v) => {
  _paused.value = !!v;
};

const stop = () => {
  if (_currentAnimation.value) {
    _currentAnimation.value.stopAnimation();
  }
};

const playNext = (name, infinite) => {
  switch (name) {
    case "idle":
      _idleAnimation.value.play(1102, infinite);
      return _idleAnimation.value;
    case "attack":
      _attackAnimation.value.play(1300, infinite);
      return _attackAnimation.value;
    case "walk":
      _walkAnimation.value.play(1000, infinite);
      return _walkAnimation.value;
    case "victory":
      _victoryAnimation.value.play(1500, infinite);
      return _victoryAnimation.value;
    default:
      console.error("Unexpected animation name")
  }
}

let attackTimeout = ref(null);
watchEffect(() => {
     if (myCharacterAction.value === 'attackFarm') {
      if (!creepAnimationIndicator.value) return;
        attackTimeout.value = setTimeout(() => {
          play('attack', false);
          setTimeout(() => {
            attackTimeout.value = null;
            myCharacterAction.value = 'idle';
          }, 1300);
        }, 1000);
    } else if (myCharacterAction.value === 'attack') {
        play('attack', false);
        setTimeout(() => {
          myCharacterAction.value = 'idle';
        }, 1300);
    } else if (myCharacterAction.value === 'walk') {
          play('walk', true);
          setTimeout(() => {
            myCharacterAction.value = 'idle';
          }, 3500);
      }
     else {
      play('idle', true);
    }
});

watchEffect(() => {
  // if (eventAction.value === 'death' && awardsClosedIndicator.value) {
  if (eventAction.value === 'death') {
      play('victory', false);
        setTimeout(() => {
          myCharacterAction.value = 'idle';
          play('idle', true);
        }, 2000);
      return;
    }
})


watchEffect(() => {
  if (attackTimeout.value && !creepAnimationIndicator.value) {
    clearTimeout(attackTimeout.value);
    attackTimeout.value = null;
  }
});

watchEffect(() => {
  if (!myCharacterPosition.value) return;
  if (!isRegistered.value) {
      mapWidth.value = 4 * window.outerHeight;

    basePosition.value = Math.floor(((myCharacterPosition.value) / 100) * mapWidth.value + 400);
  } else {
      mapWidth.value = 4 * 4 * window.outerHeight;

      if (window.outerWidth < 1100) {
        basePosition.value = Math.floor((Math.abs(myCharacterPosition.value + 5) / 100) * mapWidth.value);
      } else {
        basePosition.value = Math.floor((Math.abs(myCharacterPosition.value + 5) / 100) * mapWidth.value);
      }
  }
})

onMounted(() => {
  let animationSize = 600;
  if (window.outerWidth > 1600 || window.outerHeight > 800) {
    animationSize = 700;
  }

  if (window.outerWidth > 1900 || window.outerHeight > 900) {
    animationSize = 800;
  }

  
  _idleAnimation.value = new TileAnimation(canvas.value, animationSize, animationSize, idleFrames);
  _attackAnimation.value = new TileAnimation(canvas.value, animationSize, animationSize, attackFrames);
  _walkAnimation.value = new TileAnimation(canvas.value, animationSize, animationSize, walkFrames);
  _victoryAnimation.value = new TileAnimation(canvas.value, animationSize, animationSize, victoryFrames);

  _idleAnimation.value.setQueue(queue.value).setState(animationState);
  _attackAnimation.value.setQueue(queue.value).setState(animationState);
  _walkAnimation.value.setQueue(queue.value).setState(animationState);
  _victoryAnimation.value.setQueue(queue.value).setState(animationState);
  
  if (!isRegistered.value) {
      mapWidth.value = 4 * window.outerHeight;

    basePosition.value = Math.floor(((myCharacterPosition.value) / 100) * mapWidth.value + 400);
  } else {
      mapWidth.value = 4 * 4 * window.outerHeight;
      
      if (window.outerWidth < 1100) {
        basePosition.value = Math.floor((Math.abs(myCharacterPosition.value + 5) / 100) * mapWidth.value);
      } else {
        basePosition.value = Math.floor((Math.abs(myCharacterPosition.value + 5) / 100) * mapWidth.value);
      }
  }

  let width = window.outerWidth;
  if (window.outerWidth < 700) {
    width = 700;
  }

  document.body.addEventListener('scroll', () => {
    if (currentUserAction.value === 'go' || creepAnimationIndicator.value || myCharacterAction !== 'idle') return;
    if (animationState.value.state === "playing" || isAwardsWindowOpened.value || isRouletteWindowOpened.value) {
      if (Math.abs(document.body.scrollLeft - (basePosition.value)) >= width && !isRegistered.value) {
        stop();
      }
      if (isRegistered.value && document.body.scrollLeft >= basePosition.value || basePosition.value - document.body.scrollLeft >= width) {
          stop();
      }
      return;
    }
    if (animationState.value.state === "stopped" &&
    !isAwardsWindowOpened.value && !isRouletteWindowOpened.value) {
      if (Math.abs(document.body.scrollLeft - (basePosition.value)) < width && !isRegistered.value) {
        play('idle', true);
      }
      if (isRegistered.value && (document.body.scrollLeft < basePosition.value && basePosition.value - document.body.scrollLeft < width * 1.4 )) {
          play('idle', true);
      }
    }
  })

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