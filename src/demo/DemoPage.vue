<script setup lang="ts">
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';

interface DemoTask {
  id: string;
  title: string;
  description: string;
  type: string;
}

interface DemoQuestion {
  question: string;
  answer: string;
}

const route = useRoute();
const page = computed<string>(() => route.path.replace('/', ''));

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const currentLevel = computed<number>(() => Math.max(1, user.value.level || 1));
const points = computed<number>(() => user.value.points || 0);
const moves = 'Unlimited';

const demoTasks: DemoTask[] = [
  { id: 'map', title: 'Explore the game map', description: 'Use the region controls to visit Radiant, River, Dire and Ancient.', type: 'Exploration' },
  { id: 'farm', title: 'Try a farming action', description: 'Use the controls in the game to see the original roulette animation.', type: 'Gameplay' },
  { id: 'attack', title: 'Inspect a combat encounter', description: 'Discover an enemy event and the damage animation.', type: 'Gameplay' },
  { id: 'level', title: 'View the level progression', description: 'Open the map progress UI and see how the level system is presented.', type: 'Progress' },
  { id: 'faq', title: 'Read the project FAQ', description: 'Learn what is interactive and what relies on archived services.', type: 'About' },
];

// Local UI checklist only. It does not award currency, spins or account rewards.
const exploredIds = ref<string[]>([]);
const toggleExplored = (id: string): void => {
  exploredIds.value = exploredIds.value.includes(id)
    ? exploredIds.value.filter((item: string) => item !== id)
    : [...exploredIds.value, id];
};

const questions: DemoQuestion[] = [
  {
    question: 'What is Dota Battlepass?',
    answer: 'An archived interactive game frontend created for a Dota-themed promotional experience. This version is a standalone technical demo, not an active promotional event.',
  },
  {
    question: 'How do I explore the game?',
    answer: 'Open Game, continue past the introduction, then drag/scroll across the entire map or use Radiant, River, Dire and Ancient buttons to jump between all four regions. The demo provides unlimited moves, 13 sample encounters and 25 fictional level stages.',
  },
  {
    question: 'Does this demo require an account?',
    answer: 'No. The public demo uses guest state and local sample data across all four map regions. Steam, Twitch and BetBoom account connections have been disabled.',
  },
  {
    question: 'Do game points or prizes have real value?',
    answer: 'No. Any progress, moves, badges and rewards shown here are illustrative frontend elements. Nothing can be withdrawn or redeemed.',
  },
  {
    question: 'Are there real tasks, betting or transactions?',
    answer: 'No. The Tasks page is an interactive checklist for exploring the demo. Real betting, payments and external task verification are unavailable.',
  },
  {
    question: 'What technology was used?',
    answer: 'The project is built with Vue 3, TypeScript, Pinia, SCSS, Vite and GSAP. The original API integrations remain in the source but are blocked by default in the public demo.',
  },
];
const expandedQuestion = ref<number | null>(0);
const toggleQuestion = (index: number): void => {
  expandedQuestion.value = expandedQuestion.value === index ? null : index;
};
</script>

<template>
  <main class="demo-page">
    <div class="demo-page__container">
      <header class="demo-page__header">
        <p class="demo-page__eyebrow">DOTA BATTLEPASS / FRONTEND DEMO</p>
        <h1 v-if="page === 'tasks'">Explore <span>Tasks</span></h1>
        <h1 v-else-if="page === 'account'">Demo <span>Profile</span></h1>
        <h1 v-else-if="page === 'faq'">Frequently Asked <span>Questions</span></h1>
        <h1 v-else>About the <span>Demo</span></h1>
        <p class="demo-page__intro">
          <template v-if="page === 'tasks'">A small checklist for exploring the original frontend. These aren't real missions or paid tasks.</template>
          <template v-else-if="page === 'account'">A read-only view of the local game state. No registration or external accounts are required.</template>
          <template v-else-if="page === 'faq'">How to explore this archived game and what is no longer connected.</template>
          <template v-else>The original interactive game, restored as a standalone portfolio showcase.</template>
        </p>
      </header>

      <section v-if="page === 'tasks'" class="demo-page__panel">
        <div class="demo-page__section-heading">
          <h2>Explore the features</h2>
          <span>{{ exploredIds.length }} / {{ demoTasks.length }} explored</span>
        </div>
        <div class="demo-page__task-list">
          <article v-for="task in demoTasks" :key="task.id" class="demo-page__task">
            <div class="demo-page__task-body">
              <span class="demo-page__tag">{{ task.type }}</span>
              <h3>{{ task.title }}</h3>
              <p>{{ task.description }}</p>
            </div>
            <button type="button" class="demo-page__task-button" :class="{ 'demo-page__task-button--done': exploredIds.includes(task.id) }" @click="toggleExplored(task.id)">
              {{ exploredIds.includes(task.id) ? 'Explored ✓' : 'Mark explored' }}
            </button>
          </article>
        </div>
        <p class="demo-page__footnote">These checkmarks are only for the current page visit and aren't linked to gameplay rewards.</p>
      </section>

      <section v-else-if="page === 'account'" class="demo-page__panel">
        <div class="demo-page__section-heading">
          <h2>Guest game state</h2>
          <span>LOCAL DATA</span>
        </div>
        <div class="demo-page__stats">
          <div class="demo-page__stat"><span>Current level</span><strong>{{ currentLevel }}</strong></div>
          <div class="demo-page__stat"><span>Experience points</span><strong>{{ points }}</strong></div>
          <div class="demo-page__stat"><span>Available moves</span><strong>{{ moves }}</strong></div>
        </div>
        <div class="demo-page__info">
          <h3>What happened to the original account features?</h3>
          <p>The original interface connected to promotional accounts and showed prizes, Steam/Twitch connections and rewards. Those services are not available in this standalone frontend demo, so we don't ask visitors to sign in or enter personal details.</p>
        </div>
      </section>

      <section v-else-if="page === 'faq'" class="demo-page__panel">
        <div class="demo-page__section-heading"><h2>Project FAQ</h2><span>{{ questions.length }} QUESTIONS</span></div>
        <div class="demo-page__questions">
          <article v-for="(item, index) in questions" :key="item.question" class="demo-page__question">
            <button type="button" :aria-expanded="expandedQuestion === index" @click="toggleQuestion(index)">
              {{ item.question }}<span aria-hidden="true">{{ expandedQuestion === index ? '−' : '+' }}</span>
            </button>
            <p v-if="expandedQuestion === index">{{ item.answer }}</p>
          </article>
        </div>
      </section>

      <section v-else class="demo-page__panel">
        <div class="demo-page__section-heading"><h2>What you can explore</h2><span>ARCHIVED PROJECT</span></div>
        <div class="demo-page__info">
          <h3>Interactive frontend</h3>
          <p>Explore a horizontally scrolling illustrated map, character sprites, game events, roulette interactions, progress UI and responsive game screens. The project was developed using Vue 3, TypeScript, Pinia, GSAP and SCSS.</p>
          <h3>Demo limitations</h3>
          <p>The original promotion has ended. Authentication, gambling/betting links, prize redemption, payment flows, analytics tracking and all external API requests are disabled in this public version. Game progress is fictional and is not saved to a server.</p>
          <h3>Original integration code</h3>
          <p>The historical API services and state-management implementation are retained in the repository as examples of the original frontend architecture, but are not used by the public demo.</p>
        </div>
      </section>

      <div class="demo-page__actions">
        <RouterLink class="demo-page__button" to="/">Explore game →</RouterLink>
        <RouterLink v-if="page !== 'faq'" class="demo-page__secondary" to="/faq">Project FAQ</RouterLink>
        <RouterLink v-else class="demo-page__secondary" to="/about">About this demo</RouterLink>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.demo-page {
  min-height: 100vh;
  padding: 5rem 2rem 13rem;
  overflow-x: hidden;
  background: url('@/assets/img/texture.png'), linear-gradient(160deg, #2c292e 0%, #18191c 100%);
  color: #f1f1f1;
  font-family: 'Gilroy', sans-serif;

  &__container { max-width: 96rem; margin: 0 auto; }
  &__header { margin-bottom: 3rem; padding-right: 1rem; }
  &__eyebrow { margin-bottom: 1.2rem; color: #58dd58; font-size: 1.2rem; letter-spacing: .13em; }
  h1 { margin: 0 0 1.5rem; font-family: 'Reaver', 'Gilroy', sans-serif; font-size: clamp(3.4rem, 5vw, 6rem); line-height: 1.08; }
  h1 span { color: #50df51; }
  &__intro { max-width: 65rem; color: #b6b6b9; font-size: 1.6rem; line-height: 1.55; }

  &__panel {
    border: .1rem solid rgba(255, 255, 255, .11);
    border-radius: 1.2rem;
    padding: 2.8rem;
    background: rgba(18, 19, 22, .8);
    box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, .15);
  }
  &__section-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    h2 { font-size: 2.2rem; }
    span { font-size: 1.2rem; color: #70cc72; letter-spacing: .08em; text-align: right; }
  }

  &__task-list { display: grid; gap: 1.2rem; }
  &__task {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    padding: 1.8rem 1.9rem;
    border: .1rem solid rgba(255, 255, 255, .09);
    border-radius: .8rem;
    background: rgba(255, 255, 255, .035);
  }
  &__task-body { min-width: 0; h3 { margin: .7rem 0 .6rem; font-size: 1.7rem; } p { color: #aaa; font-size: 1.35rem; line-height: 1.45; } }
  &__tag { color: #5ee267; font-size: 1.1rem; letter-spacing: .06em; text-transform: uppercase; }
  &__task-button {
    flex-shrink: 0;
    padding: 1.1rem 1.6rem;
    border: .1rem solid #4fbb50;
    border-radius: .6rem;
    color: #6bef74;
    font-size: 1.3rem;
    cursor: pointer;
    &:hover { background: rgba(63, 198, 69, .12); }
    &:focus-visible { outline: .2rem solid #5ce66b; outline-offset: .3rem; }
    &--done { color: #191a1c; background: #57dd59; }
  }
  &__footnote { margin-top: 1.5rem; color: #959598; font-size: 1.25rem; }

  &__stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; }
  &__stat {
    display: flex; flex-direction: column; gap: 1.3rem;
    padding: 2rem; border-radius: .8rem;
    background: #29282c;
    span { color: #afafb0; font-size: 1.3rem; }
    strong { color: #64e36a; font-size: 3.6rem; }
  }
  &__info { margin-top: 2.5rem; h3 { margin: 1.8rem 0 .8rem; font-size: 1.8rem; } p { color: #b9b9bc; font-size: 1.5rem; line-height: 1.6; } }
  &__questions { border-top: .1rem solid rgba(255, 255, 255, .08); }
  &__question {
    border-bottom: .1rem solid rgba(255, 255, 255, .1);
    button {
      display: flex; justify-content: space-between; align-items: center;
      width: 100%; gap: 1.5rem; padding: 1.8rem .5rem;
      font-size: 1.6rem; font-weight: 700; text-align: left; cursor: pointer;
      span { color: #5fe55e; font-size: 2.4rem; }
      &:focus-visible { outline: .2rem solid #5fe55e; outline-offset: .2rem; }
    }
    p { max-width: 75rem; padding: 0 3rem 2rem .5rem; color: #bebec2; font-size: 1.45rem; line-height: 1.6; }
  }
  &__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 2rem; margin-top: 3rem; }
  &__button {
    display: inline-flex; align-items: center; min-height: 4.4rem;
    padding: 1.3rem 2.3rem; border-radius: .6rem;
    background: linear-gradient(180deg, #45e84f 0%, #288e23 100%);
    color: #111; font-size: 1.5rem; font-weight: 700;
    &:hover { filter: brightness(1.1); }
  }
  &__secondary { color: #bfc4be; font-size: 1.45rem; &:hover { color: #65e46d; } }

  @media only screen and (max-width: 850px) {
    padding: 6.5rem 1.5rem 12rem;
    &__panel { padding: 1.8rem; }
    &__task { align-items: flex-start; flex-direction: column; gap: 1.4rem; }
    &__task-button { width: 100%; }
    &__stats { grid-template-columns: 1fr; }
    &__stat { flex-direction: row; align-items: center; justify-content: space-between; strong { font-size: 2.8rem; } }
    &__section-heading h2 { font-size: 1.8rem; }
  }
}
</style>
