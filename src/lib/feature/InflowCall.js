import jsCookie from 'js-cookie';
import queryString from 'query-string';
import state from '@@state';
import callTrackSever from '../module/CallTrackServer';

const { configs } = state;

// const ekamsConfig = {
//   key: 'EKAMS',
//   sendQueryKey: 'cekams',
//   cookieKey: 'ekams',
//   partialMatch: [/^\D+(\.\d+){5}$/g],
// };

const setCookie = (advertiserId, cookieKey, value) => {
  jsCookie.set(`emf.${advertiserId}.${cookieKey}`, value, { expires: 30 });
};

const getCookie = (advertiserId, cookieKey) => {
  return jsCookie.get(`emf.${advertiserId}.${cookieKey}`);
};

const inflowCall = (advertiserId /* , args */) => {
  const query = queryString.parse(window.location.search);
  const queryEkams = query.EKAMS;
  const config = configs[advertiserId];
  const sendQuery = {}; // click 서버에 보내는 쿼리 목록
  const sendQueryKeyToCookieKey = {}; // 쿠키 어시스트 조정용

  if (Number(queryEkams?.split('.')[1]) === advertiserId) {
    return;
  }

  let isCallCondition = !!queryEkams || config.requireInflowQuery === true;
  const { trackQueryKeyList } = config;
  trackQueryKeyList.forEach((elmList) => {
    const isSatisfied = elmList.every((elm) => {
      const { key, exactlyMatch, partialMatch } = elm;
      let { sendQueryKey, cookieKey } = elm;
      sendQueryKey = sendQueryKey || key;
      cookieKey = cookieKey || key;
      sendQueryKeyToCookieKey[sendQueryKey] = cookieKey;
      const value = query[key];
      sendQuery[sendQueryKey] = value;
      if (exactlyMatch) {
        return exactlyMatch.includes(value);
      }
      if (partialMatch) {
        return partialMatch.some((regExp) => new RegExp(regExp).test(value));
      }
      return value;
    });
    if (isSatisfied) {
      isCallCondition = true;
    }
  });

  if (!isCallCondition) {
    return;
  }

  const currentTime = new Date().getTime();
  const ekamsInCookie = getCookie(advertiserId, 'ekams');

  Object.keys(sendQuery).forEach((key) => {
    if (!sendQuery[key]) {
      sendQuery[key] = 'none';
    }
  });

  const cekams = `${queryEkams || 'none'}_${currentTime}`;
  if (!ekamsInCookie) {
    console.warn('33');
  } else {
    const ekamsList = ekamsInCookie.split('|');
    const ekamsLength = ekamsList.length;
    const latestIndex = ekamsLength - 1;
    const latestEkams = ekamsList[latestIndex];
    const [ltEkams] = latestEkams;
    const latestSameEkams = ltEkams === queryEkams;
    Object.entries(sendQueryKeyToCookieKey).forEach(
      ([sendQueryKey, cookieKey]) => {
        const cookies = getCookie(advertiserId, cookieKey) || [];
        const [first = 'none', assist = 'none', latest = 'none'] = cookies;
        const changeLatestCookie = sendQuery[sendQueryKey];
        const changeCookies = [];
        if (ekamsLength === 3) {
          changeCookies.push(first);
          if (latestSameEkams) {
            changeCookies.push(assist);
          } else {
            changeCookies.push(latest);
          }
        } else if (ekamsLength === 2) {
          changeCookies.push(first);
          if (!latestSameEkams) {
            changeCookies.push(assist);
          }
        } else if (!latestSameEkams) {
          changeCookies.push(first);
        }
        changeCookies.push(changeLatestCookie);
      }
    );
  }
  callTrackSever('click', queryString.stringify(sendQuery));
};

export default inflowCall;
