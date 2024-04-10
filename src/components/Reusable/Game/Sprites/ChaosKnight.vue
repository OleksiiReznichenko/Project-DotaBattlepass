<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';
import { useAuthStore } from '@/stores/auth';

import TileAnimation from '@/assets/js/tile-animation';

const props = defineProps(['position', 'userId', 'userLevel', 'currentEvent', 'prevEvent']);

const baseStore = useBaseStore();
const { isAwardsWindowOpened, isRouletteWindowOpened, myCharacterAction, eventAction, awardsClosedIndicator } = storeToRefs(baseStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const importAll = (r) => {
  const arr = [];
  for (const key in r) {
      arr.push(key);
  }
  return arr;
}
const idleFrames = ref(importAll(import.meta.glob("/src/assets/sprites/Chaos_Knight/Idle/*")));
const damageFrames = ref(null);
const deathFrames = ref(null);

const _idleAnimation = ref(null);
const _damageAnimation = ref(null);
const _deathAnimation = ref(null);

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

const endAnimationIndicator = ref(false);

const playNext = (name, infinite) => {
  if (endAnimationIndicator.value) return;
  switch (name) {
    case "idle":
      _idleAnimation.value.play(1533, infinite);
      return _idleAnimation.value;
    case "damage":
      _damageAnimation.value?.play(800, infinite);
      return _damageAnimation.value;
    case "death":
      if (isRegistered.value) {
        endAnimationIndicator.value = true;
      }
      _deathAnimation.value?.play(2000, infinite);
      return _deathAnimation.value;
    default:
      console.error("Unexpected animation name")
  }
}

const checkAnimationVisibility = () => {
  let widthIndex = 2.8;
  let widthIndex2 = 1.3;
  let widthIndex3 = 2.8;
  if (window.outerWidth < 1600 && window.outerWidth > 1300) {
    widthIndex2 = 1.8;
  }

  if (window.outerWidth >= 1600) {
    widthIndex = .2;
    widthIndex2 = 2.4;
    widthIndex3 = 1;
  }

  if (window.outerWidth < 1000) {
    widthIndex = 2;
  }

  if (window.outerWidth < 600) {
    widthIndex = .2;
    widthIndex3 = .8;
    widthIndex2 = 2.3;
  }

  if (eventAction.value === 'damage' || eventAction.value === 'death') return;

  if (animationState.value.state === "stopped" && document.body.scrollLeft - basePosition.value < window.outerWidth / widthIndex3 &&
    basePosition.value - document.body.scrollLeft < window.outerWidth * widthIndex2) {
    play('idle', true);
    return;
  }

  if (animationState.value.state === "playing" && (document.body.scrollLeft - basePosition.value >= window.outerWidth / widthIndex ||
  basePosition.value - document.body.scrollLeft >= window.outerWidth * widthIndex2)) {
    if (isAwardsWindowOpened.value || isRouletteWindowOpened.value) {
      stop();
      return;
    }
    stop();
    return;
  }
};

const calcPositions = () => {
  if (!props.userId) {
      mapWidth.value = 4 * window.outerHeight;

    basePosition.value = Math.floor(((props.position + 3) / 100) * mapWidth.value);
  } else {
      mapWidth.value = 4 * 4 * window.outerHeight;

      let positionIndex = 3;
      if (window.outerWidth < 600) {
        positionIndex = 4;
      }

      basePosition.value = Math.floor((Math.abs(props.position + positionIndex) / 100) * mapWidth.value);
  }
}

watchEffect(() => {
  if (eventAction.value === 'death') return;
  if (isAwardsWindowOpened.value || isRouletteWindowOpened.value) {
    stop();
  } else {
    checkAnimationVisibility();
  }
});

watchEffect(() => {
  if (!props.userId) {
    calcPositions();
  } else {
    calcPositions();
  }
})

watchEffect(() => {
  if (eventAction.value === 'damage' && props.userLevel === props.currentEvent?.userLevel && damageFrames.value) {
    play('damage', false);
    setTimeout(() => {
      play('idle', true);
      eventAction.value = 'idle';
    }, 1500);
  } 
  if (eventAction.value === 'death' && 
  (props.userLevel - props.prevEvent?.userLevel >= 0 || props.userLevel - props.prevEvent?.userLevel >= 0) && deathFrames.value) {
    play('death', false);
    setTimeout(() => {
      eventAction.value = 'idle';
    }, 6000);
  }
})

watchEffect(() => {
  if (props.userId && props.userLevel === 15) {
    deathFrames.value = importAll(import.meta.glob("/src/assets/sprites/Chaos_Knight/Death/*"));
    damageFrames.value = importAll(import.meta.glob("/src/assets/sprites/Chaos_Knight/Damage/*"));
  }
})

watchEffect(() => {
  if (deathFrames.value && damageFrames.value && canvas.value) {
    _deathAnimation.value = new TileAnimation(canvas.value, 1400, 1000, deathFrames.value);
    _damageAnimation.value = new TileAnimation(canvas.value, 1400, 1000, damageFrames.value);

    _deathAnimation.value.setQueue(queue.value).setState(animationState);
    _damageAnimation.value.setQueue(queue.value).setState(animationState);
  }
})

let playedIndicator = ref(false);
watchEffect(() => {
  if (isRegistered.value && !playedIndicator.value && idleFrames.value) {
    setTimeout(() => {
      calcPositions();
    checkAnimationVisibility();
    playedIndicator.value = true;
    }, 2000);
  }
})

onMounted(() => {
  _idleAnimation.value = new TileAnimation(canvas.value, 1400, 1000, idleFrames.value);

  _idleAnimation.value.setQueue(queue.value).setState(animationState);
  
  calcPositions();
  checkAnimationVisibility();

  document.body.addEventListener('scroll', () => {
    checkAnimationVisibility();
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