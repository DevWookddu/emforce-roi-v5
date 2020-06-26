import state from '@@state';
import init from './lib/feature/Init';
import inflowCall from './lib/feature/InflowCall';
import errorNotify from './lib/module/ErrorNotify';

const { scriptLoading, configs, queue } = state;

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
    case 'inflow':
      inflowCall(advertiserId, args);
      break;
    default:
      errorNotify(`'${callType}'은 존재하지 않는 전환 타입입니다.`);
  }
};

const EmfV5 = (callType, advertiserId, args) => {
  if (initScript(callType, advertiserId, args)) {
    callMethod(callType, advertiserId, args);
  }
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
  queue.splice(0, queue.length - 1, ...notCallList);
  callList.forEach(([callType, advId, args]) => {
    EmfV5(callType, advId, args);
  });
};

if (window?.EmfV5?.queue?.length) {
  window.EmfV5.queue.forEach(([callType, advertiserId, args]) => {
    EmfV5(callType, advertiserId, args);
  });
}

if (typeof define === 'function' && define.amd) {
  define(() => {
    return EmfV5;
  });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmfV5;
} else {
  window.EmfV5 = EmfV5;
}
