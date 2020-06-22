import { ADVERTISER_ID } from './constants/Common';

(() => {
  if (window.EmfV5) {
    return;
  }
  let advertiserId;
  const ROI = {};

  Object.defineProperties(ROI, {
    [ADVERTISER_ID]: {
      set(value) {
        if (advertiserId) {
          const alertMessage = '광고주 ID가 이미 설정되어 있습니다.';
          if (window.alert) {
            // eslint-disable-next-line no-alert
            window.alert(alertMessage);
          }
          // eslint-disable-next-line no-console
          console.error(alertMessage);
        }
        advertiserId = value;
      },
      get() {
        return advertiserId;
      },
    },
  });

  const EmfV5 = (type, args) => {
    switch (type) {
      case 'init':
        ROI[ADVERTISER_ID] = args[ADVERTISER_ID];
        break;
      default:
    }
  };

  if (typeof define === 'function' && define.amd) {
    define(() => {
      return EmfV5;
    });
  } else if (typeof module !== 'undefined') {
    module.exports = EmfV5;
  } else {
    window.EmfV5 = EmfV5;
  }
})();
