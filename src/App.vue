<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router';
import { onDeactivated, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import { storeToRefs } from "pinia";
import { useBaseStore } from '@/stores/index';
import { useAuthStore } from '@/stores/auth';
import { useUserStore } from '@/stores/user';
import { useLevelsStore } from '@/stores/levels';
import { useEventsStore } from '@/stores/events';
import AppNav from '@/components/Reusable/App/Nav.vue';
import PreviewScreen from '@/components/Singular/Game/PreviewScreen.vue';
import { useRouletteStore } from '@/stores/roulette';
import { authBetBoom } from './services/http/http.helper';

// IF TOUCHPAD DEVICE'S HEIGHT CHANGES - CHANGE BASE 100VH HEIGHT
const appHeight = (): void => {
    const doc = document.documentElement;
    if (window.outerWidth < 1000) {
        doc.style.setProperty('--app-height', `${window.innerHeight * 1.05}px`);
    } else {
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    }
};

// ON WINDOW RESIZE
const onResize = (): void => {
  appHeight();
};

const baseStore = useBaseStore();
const { 
  isAwardsWindowOpened, allLevelsFinishedIndicator, endLightLineIndicator, myCharacterAction,
   creepAnimationIndicator, isRouletteWindowOpened, goToNextEvent, currentUserAction, updateProgressBarPositionIndicator
   } = storeToRefs(baseStore);

const eventsStore = useEventsStore();
const { fightEvents, prizesForLevels, allPrizes } = storeToRefs(eventsStore);

const levelsStore = useLevelsStore();
const { levels } = storeToRefs(levelsStore);

const rouletteStore = useRouletteStore();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const authStore = useAuthStore();
const { isRegistered, token } = storeToRefs(authStore);

let isLastLevelIndicator = ref<boolean>(false);

watchEffect(() => {
  if (levels.value.length < 1) return;
  if (isRegistered.value) {
    if (user.value.level === levels.value[levels.value.length - 1].levelId) {
      allLevelsFinishedIndicator.value = true;
    }
  } else {
    const currentLevel = levels.value.find((el, i, arr) => {

    if (i + 1 === arr.length) {
      isLastLevelIndicator.value = true;
      return el.points;
    }
    if (el.points === 0 && user.value.points < arr[i + 1].points) {
      return el;
    }
    return user.value.points - arr[i + 1].points < 0
    })

    // if (isLastLevelIndicator.value && user.value.points >= currentLevel!.points) {
    //   allLevelsFinishedIndicator.value = true;
    // }

    if (currentLevel || currentLevel === 0) {
    user.value.level = currentLevel.levelId;
    } else {
    user.value.level = 1;
    }
  }
});

// let isUpdated = ref(false);
// watchEffect(() => {
//   if (user.value.id) {
//     if (!isUpdated.value) {
//       // user.value.points = 22000;
//       // user.value.points = 18000;
//       user.value.points = 7600;
//       isUpdated.value = true;
//     }

//     const currentLevel = levels.value.find((el, i, arr) => {

//     if (i + 1 === arr.length) {
//       isLastLevelIndicator.value = true;
//       return el.points;
//     }
//     if (el.points === 0 && user.value.points < arr[i + 1].points) {
//       return el;
//     }
//     return user.value.points - arr[i + 1].points < 0
//     })

//     // if (isLastLevelIndicator.value && user.value.points >= currentLevel!.points) {
//     //   allLevelsFinishedIndicator.value = true;
//     // }

//     if (currentLevel || currentLevel === 0) {
//     user.value.level = currentLevel.levelId;
//     } else {
//     user.value.level = 1;
//     }
//   }
// })

watchEffect(() => {
  if (isRegistered.value) {
    levelsStore.getLevels();
    eventsStore.setEvents(true);
  } else  {
    levelsStore.setStaticLevels();
    eventsStore.setEvents(false);
  }
});

// watchEffect(() => {
//   if (!endLightLineIndicator.value || !isRegistered.value) return;
//   user.value.points = 0;
//   user.value.level = 1;
//   setTimeout(() => {
//     allLevelsFinishedIndicator.value = false;
//     isLastLevelIndicator.value = false;
//   }, 1000);
// });

const html = ref<null | HTMLElement>(null)

const route = useRoute();

watch(route, () => {
  if (route.name !== 'game') {
    isAwardsWindowOpened.value = false;
    document.body.classList.remove('body-grab');
    document.body.classList.remove('body-grabbing');
    document.body.classList.remove('body-game');
    myCharacterAction.value = 'idle';
    creepAnimationIndicator.value = false;
    if (html.value) {
      html.value.classList.remove('body-game');
    }

    const currentEvent = fightEvents.value.find(el => {
        return el.userLevel === user.value.level;
    });
    if (!currentEvent) return;
    myCharacterAction.value = 'idle';
    goToNextEvent.value = true;
    updateProgressBarPositionIndicator.value = true;
  } else {
    document.body.classList.add('body-grab');
    document.body.classList.add('body-game');

    if (html.value) {
      html.value.classList.add('body-game');
    }
  }
})

watch(isRegistered, (newValue) => {
  if (newValue) {
      setTimeout(() => {
        userStore.getUserInfo();
        allLevelsFinishedIndicator.value = false;
        isAwardsWindowOpened.value = false;
      }, 5000);
  }
})

// watchEffect(() => {
//   if (!isRegistered.value && user.value.id) {
//     user.value = {
//       id: '',
//       points: 0,
//       balance: 0,
//       lastSeen: new Date(),
//       userId: '',
//       spaceId: '',
//       levelId: '',
//       createdAt: '',
//       updatedAt: '',
//       level: 0
//     }
  // }
// })


onMounted(() => {
  html.value = document.querySelector('html');
  appHeight();

  authBetBoom();
  
  // userStore.getUser();
  // userStore.getUserInfo();
  // rouletteStore.getRoullettes();
  // eventsStore.getPrizesForLevels();

  if (!isRegistered.value) {
    allLevelsFinishedIndicator.value = false;
  }
  
  // ADD WINDOW EVENT LISTENER
  window.addEventListener('resize', onResize);

  let googleLetManagerScript = document.createElement('script');
  googleLetManagerScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-3FGF7CGPH2');
  googleLetManagerScript.async = true;

  let gtagScript = document.createElement('script');
  gtagScript.innerHTML = "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-3FGF7CGPH2');";
  document.head.appendChild(googleLetManagerScript);
  document.head.appendChild(gtagScript);


  window.addEventListener("message", receiveMessage, false);

    function receiveMessage(event: any)
    {
        if(event.data.type === 'betboom_user_logout') {
          console.log('[x] logouting...')
          token.value = null;
          isRegistered.value = false;
          window.location.reload();
        }
    }
})

onUnmounted(() => {
  // REMOVE WINDOW EVENT LISTENER
  window.removeEventListener('resize', onResize);
})
</script>

<template>
  <router-view v-slot="{ Component }">
    <Transition>
      <component :is="Component" />
    </Transition>
  </router-view>
  <PreviewScreen />
  <AppNav />
</template>

<style lang="scss">
.desktop {
  @media only screen and (max-width: 850px) {
    display: none !important;
  }
}

.mobile {
  @media only screen and (min-width: 850px) {
    display: none !important;
  }
}

.closed {
  opacity: 0;
  visibility: hidden;
}

.blured {
  filter: blur(10px);
}

.body-game {
  overflow-y: hidden;
  height: 100vh;
}

.body-grab {
  -moz-user-select: none !important;
  -webkit-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;

  .main-map {
    cursor: grab;
  }
}

.body-grabbing {
  -moz-user-select: none !important;
  -webkit-user-select: none !important;
  -ms-user-select: none !important;
  user-select: none !important;

  .main-map {
    cursor: grabbing;
  }
}

canvas {
  position: absolute;
  bottom: 0;
}

.btn {
  font-family: Reaver;
  text-align: center;
  padding: 1.2rem 0;
  text-shadow: 0px 2px 4px rgba(6, 13, 46, 0.5);
  background-size: cover;
  transition: all .2s;

  &:hover {
    transform: scale(1.01);
  }
}

.btn-red {
  background-image: url(@/assets/svg/redButton.svg);
}

.btn-yellow {
  background-image: url(@/assets/svg/yellowButton.svg);
}

.btn-green {
  background-image: url(@/assets/svg/greenButton.svg);
}

.btn-transparent {
  @include greenGradientText;
}

@keyframes rotation {
    0% {
        transform: translate(-50%, -50%) rotate(0);
    }
    50% {
        transform: translate(-50%, -50%) rotate(720deg);
    }
    100% {
        transform: translate(-50%, -50%) rotate(0);
    }
}
</style>
