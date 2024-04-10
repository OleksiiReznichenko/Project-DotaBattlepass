import { useAuthStore } from '@/stores/auth';

export const getTokenFromCookies = (key: string) =>
  (new RegExp((key || '=') + '=(.*?); ', 'gm').exec(document.cookie + '; ') || [
    '',
    null,
  ])[1];

let interval: any = null;

export const authBetBoom = async () => {
  const authStore = useAuthStore();

  let interval: any = null;

  console.log('[x] initial sync_user');

  // await authStore.login('RU', '34fc5db8-392c-4314-ac9c-d1c5819af310');

  window.parent.postMessage({ type: 'sync_user' }, '*');

  interval = setInterval(() => {
    console.log('[x] interval sync_user');

    window.parent.postMessage({ type: 'sync_user' }, '*');
  }, 1000);

  window.addEventListener('message', receiveMessage, false);

  function receiveMessage(event: any) {
    console.log('[x] received parent message: ', event.data);

    if (event.data.type === 'betboom_user_token') {
      authStore.login(event.data.zone, event.data.token);
      clearInterval(interval);
    }
  }
};
