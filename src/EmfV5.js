import state from '@@state';
import errorNotify from '@module/ErrorNotify';
import { getQueue, setQueue, clearQueue } from '@module/HandleQueue';
import { getCookie, getEkamsCookiesJson } from '@module/HandleCookie';
import { EUUID, NONE, ADV_CONV_ID_PREFIX } from '@constant/Common';
import init from './lib/feature/Init';
import inflowCall from './lib/feature/InflowCall';
import convCall from './lib/feature/convCall';
import './lib/polyfill/object.entries';
import './lib/polyfill/array.prototype.find';
import './lib/polyfill/array.prototype.includes';
import './lib/polyfill/string.prototype.includes';

const { scriptLoading, configs } = state;
const CALL_TYPE_INFLOW = 'inflow';
const CALL_TYPE_CONV = 'conv';

// 전환 시간 데이터 초기화(최대 한달간 유지)
const MONTH_MS = 1000 * 60 * 60 * 24 * 30;
(function clearTimedOutConvTime() {
  const now = new Date().getTime();
  Object.keys(localStorage).forEach((key) => {
    if (key.includes(ADV_CONV_ID_PREFIX)) {
      const convObj = JSON.parse(localStorage.getItem(key));
      Object.entries(convObj).forEach(([sha256key, convTime]) => {
        if (now - convTime > MONTH_MS) {
          delete convObj[sha256key];
        }
      });
      if (Object.keys(convObj).length) {
        localStorage.setItem(key, JSON.stringify(convObj));
      } else {
        localStorage.removeItem(key);
      }
    }
  });
})();

const initScript = ({ advertiserId }) => {
  const isScriptLoading = !!scriptLoading[advertiserId];
  const isLoadedScript = configs[advertiserId];
  if (!isLoadedScript) {
    if (!isScriptLoading) {
      scriptLoading[advertiserId] = true;
      // Event Loop Delay
      setTimeout(() => {
        console.log(`initScript => ${advertiserId}`);
        init(advertiserId);
      }, 0);
    }
    return false;
  }
  return true;
};

const callMethod = ({ callType, advertiserId, args, inflowInfo }) => {
  switch (callType) {
    case CALL_TYPE_INFLOW:
      inflowCall({ advertiserId, args, inflowInfo });
      break;
    case CALL_TYPE_CONV:
      convCall({ advertiserId, args });
      break;
    default:
      errorNotify(`'${callType}'은 존재하지 않는 전환 타입입니다.`);
  }
};

const EmfV5 = (callType, advertiserId, args = {}, info) => {
  const inflowInfo = info || {
    referrer: document.referrer,
    query: window.location.search,
  };
  if (!Number(advertiserId)) {
    errorNotify(
      `광고주 아이디 오류 => EKAMS가 없거나, 잘못된 광고주 아이디. [${advertiserId}]`
    );
  }
  if (!initScript({ advertiserId })) {
    const q = getQueue(advertiserId);
    q.push([callType, advertiserId, args, inflowInfo]);
    setQueue(advertiserId, q);
    console.log(`[광고주 ${advertiserId}] queue => `, q);
  } else {
    callMethod({ callType, advertiserId, args, inflowInfo });
  }
};

if (window?.EmfV5?.queue?.length) {
  window.EmfV5.queue
    // window.EmfV5.queue는 inflow 최우선으로 정렬
    .sort((a, b) => {
      const aIsInflow = a[0] === CALL_TYPE_INFLOW;
      const bIsInflow = b[0] === CALL_TYPE_INFLOW;
      if (!aIsInflow && !bIsInflow) {
        return 0;
      }
      if (aIsInflow) {
        return -1;
      }
      if (bIsInflow) {
        return 1;
      }
      return 0;
    })
    .forEach(([callType, advertiserId, args]) => {
      EmfV5(callType, advertiserId, args, {
        referrer: document.referrer,
        query: window.location.search,
      });
    });
}

// EmfV5.state
Object.defineProperty(EmfV5, 'state', {
  get: () => JSON.parse(JSON.stringify(state)),
});

// EmfV5.advId
Object.defineProperty(EmfV5, 'advId', {
  get() {
    const ekamsJson = getEkamsCookiesJson();
    let advId = NONE;
    let latestTime = 0;
    Object.entries(ekamsJson).forEach(([key, value]) => {
      const latestAdvId = key.split('.')[1];
      const latestEkams = value.split('|').pop() || `${NONE}_0`;
      const time = Number(latestEkams.split('_')[1]);
      if (latestTime < time) {
        latestTime = time;
        advId = latestAdvId;
      }
    });
    return advId;
  },
});

EmfV5.getEUUID = (advertiserId) => {
  return getCookie(advertiserId, EUUID) || NONE;
};

EmfV5.loadedScript = (advertiserId) => {
  configs[advertiserId] = window.EmfV5Config[advertiserId];
  getQueue(advertiserId).forEach(([callType, advId, args, inflowInfo]) => {
    EmfV5(callType, advId, args, inflowInfo);
  });
  console.log(`loadedScript => ${advertiserId}`);
  clearQueue(advertiserId);
};

if (typeof define === 'function' && define.amd) {
  define(() => {
    return EmfV5;
  });
} else if (typeof module === 'object' && module.exports) {
  module.exports = EmfV5;
} else if (window) {
  window.EmfV5 = EmfV5;
}

export default EmfV5;
