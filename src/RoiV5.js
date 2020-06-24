import state from '@@state';
import init from './lib/feature/Init';

const callMethod = (callType, advertiserId, args) => {
  const scriptLoading = !!state.scriptLoading[advertiserId];
  const loadSuccess = state.configs[advertiserId];
  if (callType === 'init') {
    if (loadSuccess) {
      // 이미 로드 됨.
      return;
    }
    if (!scriptLoading) {
      state.scriptLoading[advertiserId] = true;
      init(advertiserId);
    }
    return;
  }

  if (loadSuccess) {
    state.queue.push([callType, advertiserId, args]);
    return;
  }

  switch (callType) {
    case 'click':
      console.warn(333);
      break;
    default:
  }
};

const EmfV5 = (callType, advertiserId, args) => {
  callMethod(callType, advertiserId, args);
};

EmfV5.callMethod = callMethod;

EmfV5.loadedScript = (advertiserId) => {
  state.configs[advertiserId] = window.EmfV5Config[advertiserId];
  const callList = [];
  const notCallList = [];
  state.queue.forEach((args) => {
    const advId = args[1];
    if (advId === advertiserId) {
      callList.push(args);
    } else {
      notCallList.push(args);
    }
  });
  state.queue = notCallList;
  callList.forEach(([callType, advId, args]) => {
    callMethod(callType, advId, args);
  });
};

if (window && window.EmfV5 && window.EmfV5.queue) {
  window.EmfV5.queue.forEach(([callType, advertiserId, args]) => {
    callMethod(callType, advertiserId, args);
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
