import { getCookie, setCookie } from '@module/HandleCookie';
import UUID from '@util/UUID';

const subDomain = process.env.CALL === 'beta' ? 'beta.' : 'beta.';

const checkUuidCookie = (advertiserId) => {
  const uuid = getCookie(advertiserId, 'uuid');
  if (!uuid) {
    setCookie(advertiserId, 'uuid', UUID());
  }
};

const getScriptCacheTime = (advertiserId) => {
  const currentTime = new Date().getTime();
  let scriptCacheTime = getCookie(advertiserId, 'cache');
  if (
    !scriptCacheTime || // 1. 스크립트가 로드 된 적이 없거나(첫 접근이거나)
    (currentTime - Number(scriptCacheTime)) / 1000 > 5 * 60 // 2. 5분이 지난 경우
  ) {
    scriptCacheTime = currentTime;
  }
  return scriptCacheTime;
};

const setScriptCacheTime = (advertiserId, scriptCacheTime) => {
  setCookie(advertiserId, 'cache', scriptCacheTime);
};

const loadScript = (advertiserId, scriptCacheTime) => {
  const script = document.createElement('script');
  script.src = `http://${subDomain}bid.emforce.co.kr/configExample.js?${advertiserId}&t=${scriptCacheTime}`;
  script.type = 'text/javascript';
  script.async = true;
  document.body.appendChild(script);
  // onerror 처리
};

export default (advertiserId) => {
  checkUuidCookie(advertiserId);
  const scriptCacheTime = getScriptCacheTime(advertiserId);
  setScriptCacheTime(advertiserId);
  loadScript(advertiserId, scriptCacheTime);
};
