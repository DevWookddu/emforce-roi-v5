import state from '@@state';
import errorNotify from '@module/ErrorNotify';
import { getCookie, getEkamsCookiesJson } from '@module/HandleCookie';
import { EUUID, NONE, ADV_CONV_ID_PREFIX } from '@constant/Common';
import init from './lib/feature/Init';
import inflowCall from './lib/feature/InflowCall';
import convCall from './lib/feature/convCall';
import './lib/polyfill/object.entries';
import './lib/polyfill/array.prototype.find';
import './lib/polyfill/array.prototype.includes';
import './lib/polyfill/string.prototype.includes';

const { scriptLoading, configs, queue } = state;
const CALL_TYPE_INFLOW = 'inflow';
const CALL_TYPE_CONV = 'conv';

(function clearTimedOutConvTime() {
  const now = new Date().getTime();
  Object.keys(localStorage).forEach((key) => {
    if (key.includes(ADV_CONV_ID_PREFIX)) {
      const calledTime = Number(localStorage.getItem(key));
      if (now - calledTime > 5 * 1000) {
        localStorage.removeItem(key);
      }
    }
  });
})();

const initScript = (callType, advertiserId, args) => {
  const isScriptLoading = !!scriptLoading[advertiserId];
  const isLoadedScript = configs[advertiserId];
  if (!isLoadedScript) {
    queue.push([callType, advertiserId, args]);
    if (!isScriptLoading) {
      scriptLoading[advertiserId] = true;
      init(advertiserId);
    }
    return false;
  }
  return true;
};

const callMethod = (callType, advertiserId, args) => {
  switch (callType) {
    case CALL_TYPE_INFLOW:
      inflowCall(advertiserId, args);
      break;
    case CALL_TYPE_CONV:
      convCall(advertiserId, args);
      break;
    default:
      errorNotify(`'${callType}'은 존재하지 않는 전환 타입입니다.`);
  }
};

const EmfV5 = (callType, advertiserId, args = {}) => {
  if (!Number(advertiserId)) {
    errorNotify(
      `광고주 아이디 오류 => EKAMS가 없거나, 잘못된 광고주 아이디. [${advertiserId}]`
    );
  }
  if (initScript(callType, advertiserId, args)) {
    callMethod(callType, advertiserId, args);
  }
};

if (window?.EmfV5?.queue?.length) {
  window.EmfV5.queue.forEach(([callType, advertiserId, args]) => {
    EmfV5(callType, advertiserId, args);
  });
}

// EmfV5.state
Object.defineProperty(EmfV5, 'state', {
  get: () => state,
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
  const callList = [];
  const notCallList = [];
  queue.forEach((args) => {
    const advId = args[1];
    if (Number(advId) === Number(advertiserId)) {
      callList.push(args);
    } else {
      notCallList.push(args);
    }
  });

  queue.splice(0, queue.length, ...notCallList);
  callList
    .sort((a, b) => {
      const aIsInflow = a[0] === CALL_TYPE_INFLOW;
      const bIsInflow = b[0] === CALL_TYPE_INFLOW;
      if (!aIsInflow && !bIsInflow) {
        return 0;
      }
      if (aIsInflow) {
        return 1;
      }
      if (bIsInflow) {
        return -1;
      }
      return 0;
    })
    .forEach(([callType, advId, args]) => {
      EmfV5(callType, advId, args);
    });
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
