<script setup>
import { ref, onMounted, watchEffect, watch } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';
import { useAuthStore } from '@/stores/auth';

import TileAnimation from '@/assets/js/tile-animation';

const props = defineProps(['position', 'userId', 'index']);

const baseStore = useBaseStore();
const { isAwardsWindowOpened, isRouletteWindowOpened } = storeToRefs(baseStore);

const authStore = useAuthStore();
const { isRegistered } = storeToRefs(authStore);

const importAll = (r) => {
  const arr = [];
  for (const key in r) {
      arr.push(key);
  }
  return arr;
}
const idleFrames = importAll(import.meta.glob("@/assets/sprites/Runes/Idle/*"));
const _idleAnimation = ref(null);

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
  if (_paused.value || !idleFrames) return;
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
      _idleAnimation.value?.play(2100, infinite);
      return _idleAnimation.value;
    default:
      console.error("Unexpected animation name")
  }
};

const checkAnimationVisibility = () => {
  let widthIndex = 1.8;
  let widthIndex2 = 1.5;
  let widthIndex3 = 1.8;
  if (window.outerWidth < 1600 && window.outerWidth > 1300) {
    widthIndex2 = 1.8;
  }

  if (window.outerWidth >= 1600) {
    widthIndex = .2;
    widthIndex2 = 2.4;
    widthIndex3 = 1;
  }

  if (window.outerWidth < 600) {
    widthIndex = .2;
    widthIndex3 = .8;
    widthIndex2 = 2.3;
  }

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

    basePosition.value = Math.floor(((props.position) / 100) * mapWidth.value + window.outerWidth * .5);
  } else {
      mapWidth.value = 4 * 4 * window.outerHeight;

      let positionIndex = 4;
      if (window.outerWidth < 600) {
        positionIndex = 5;
      }

      basePosition.value = Math.floor((Math.abs(props.position + positionIndex) / 100) * mapWidth.value);
  }
}

watchEffect(() => {
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
  if (isRegistered.value && idleFrames.value) {
    calcPositions();
    checkAnimationVisibility();
    play('idle', true);

    setTimeout(() => {
      stop()
    }, 1000);
  }
})

onMounted(() => {
    _idleAnimation.value = new TileAnimation(canvas.value, 1200, 1200, idleFrames);

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
  requestAnimationFrame(handleQueue);
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