import { useAuthStore } from '@/stores/auth';
import { DEMO_MODE } from '@/demo/config';

export const getTokenFromCookies = (key: string) =>
  (new RegExp((key || '=') + '=(.*?); ', 'gm').exec(document.cookie + '; ') || [
    '',
    null,
  ])[1];

let interval: any = null;

export const authBetBoom = async () => {
  const trustedOrigin = import.meta.env.VITE_PARENT_ORIGIN;
  if (DEMO_MODE || !trustedOrigin || window.parent === window) return;
  const authStore = useAuthStore();

  let interval: any = null;

  console.log('[x] initial sync_user');

  // await authStore.login('RU', '34fc5db8-392c-4314-ac9c-d1c5819af310');

  window.parent.postMessage({ type: 'sync_user' }, trustedOrigin);

  interval = setInterval(() => {
    console.log('[x] interval sync_user');

    window.parent.postMessage({ type: 'sync_user' }, trustedOrigin);
  }, 1000);

  window.addEventListener('message', receiveMessage, false);
  setTimeout(() => { clearInterval(interval); window.removeEventListener('message', receiveMessage); }, 10000);

  function receiveMessage(event: any) {
    console.log('[x] received parent message: ', event.data);

    if (event.origin !== trustedOrigin || !event.data) return;
    if (event.data.type === 'betboom_user_token') {
      authStore.login(event.data.zone, event.data.token);
      clearInterval(interval);
    }
  }
};
