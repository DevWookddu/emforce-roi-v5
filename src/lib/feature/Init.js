import { getCookie, setCookie } from '@module/HandleCookie';
import errorNotify from '@module/ErrorNotify';
import UUID from '@util/UUID';
import { EUUID } from '@constant/Common';
import { ANALYTICS_PATH } from '@constant/ApiURL';

const SCRIPT_CACHE_KEY = 'emfV5ScriptCache';

const checkUuidCookie = (advertiserId) => {
  const uuid = getCookie(advertiserId, EUUID);
  if (!uuid) {
    setCookie(advertiserId, EUUID, UUID(), { expires: 90 });
  }
};

const getScriptCacheTime = (advertiserId) => {
  const currentTime = new Date().getTime();
  let scriptCacheTime = localStorage.getItem(
    `${SCRIPT_CACHE_KEY}.${advertiserId}`
  );
  if (
    !scriptCacheTime || // 1. 스크립트가 로드 된 적이 없거나(첫 접근이거나)
    (currentTime - Number(scriptCacheTime)) / 1000 > 5 * 60 // 2. 5분이 지난 경우
  ) {
    scriptCacheTime = currentTime;
  }
  return scriptCacheTime;
};

const setScriptCacheTime = (advertiserId, scriptCacheTime) => {
  localStorage.setItem(`${SCRIPT_CACHE_KEY}.${advertiserId}`, scriptCacheTime);
};

const loadScript = (advertiserId, scriptCacheTime) => {
  const script = document.createElement('script');
  script.src = `${ANALYTICS_PATH}/config/conversion/v5/${advertiserId}/conf.js?t=${scriptCacheTime}`;
  script.type = 'text/javascript';
  script.async = true;
  script.onerror = () => {
    errorNotify(`${advertiserId} 광고주의 config 스크립트 로드 실패`);
  };

  const appendScript = () => {
    document.body.appendChild(script);
  };

  if (document.readyState === 'complete') {
    appendScript();
  } else {
    window.addEventListener('DOMContentLoaded', appendScript);
  }
};

export default (advertiserId) => {
  checkUuidCookie(advertiserId);
  const scriptCacheTime = getScriptCacheTime(advertiserId);
  setScriptCacheTime(advertiserId, scriptCacheTime);
  loadScript(advertiserId, scriptCacheTime);
};
