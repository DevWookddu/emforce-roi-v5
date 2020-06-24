import state from '@@state';
import init from './lib/feature/Init';

if (window && window.EmfV5 && window.EmfV5.queue) {
  const q = window.EmfV5.queue;
  state.queue = q instanceof Array ? [...window.EmfV5.queue] : [];
}

const callMethod = (type, args) => {
  switch (type) {
    case 'init':
      init(args);
      break;
    default:
  }
};

const EmfV5 = (callType, args) => {
  callMethod(callType, args);
};

if (typeof define === 'function' && define.amd) {
  define(() => {
    return EmfV5;
  });
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = EmfV5;
} else {
  window.EmfV5 = EmfV5;
}
