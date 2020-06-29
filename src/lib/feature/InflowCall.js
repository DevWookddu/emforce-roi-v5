/* eslint-disable no-console */
import jsCookie from 'js-cookie';
import queryString from 'query-string';
import state from '@@state';
import callTrackSever from '../module/CallTrackServer';

const { configs } = state;

const NONE = 'none';

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
  let sendQuery = {}; // click 서버에 보내는 쿼리 목록
  const sendQueryKeyToCookieKey = {}; // 쿠키 어시스트 조정용

  // ekams의 광고주 id가 inflow의 광고주 id와 다를 경우 호출 안함.
  if (Number(queryEkams?.split('.')[1]) !== Number(advertiserId)) {
    console.log('??');
    return;
  }

  let isCallCondition = !!queryEkams || config.requireInflowQuery === true;
  const { trackQueryKeyList } = config;
  trackQueryKeyList.forEach((elmList) => {
    const currentValidateQueryKey = {};
    let isSatisfied = true;
    elmList.forEach((elm) => {
      const { key, exactlyMatch, partialMatch } = elm;
      let { sendQueryKey, cookieKey } = elm;
      sendQueryKey = sendQueryKey || key;
      cookieKey = cookieKey || key;
      sendQueryKeyToCookieKey[sendQueryKey] = cookieKey;
      const value = query[key] || NONE;
      currentValidateQueryKey[sendQueryKey] = value;

      // 하나라도 만족하지 않은 경우가 있을 경우, 다른 키 체크 필요 X
      if (isSatisfied === false) {
        return;
      }
      if (exactlyMatch) {
        isSatisfied = exactlyMatch.includes(value);
      } else if (partialMatch) {
        isSatisfied = partialMatch.some((regExp) =>
          new RegExp(regExp).test(value)
        );
      } else {
        isSatisfied = value !== NONE;
      }
    });
    if (isSatisfied) {
      isCallCondition = true;
    } else {
      // 하나라도 만족하지 않는 경우가 있다면, 모두 none 처리
      Object.keys(currentValidateQueryKey).forEach((key) => {
        currentValidateQueryKey[key] = NONE;
      });
    }
    sendQuery = {
      ...sendQuery,
      ...currentValidateQueryKey,
    };
  });
  if (!isCallCondition) {
    return;
  }

  const currentTime = new Date().getTime();
  const cekams = `${queryEkams || NONE}_${currentTime}`;
  sendQuery.cekams = cekams;
  sendQueryKeyToCookieKey.cekams = 'ekams';
  const ekamsInCookie = getCookie(advertiserId, 'ekams');
  let ekamsLength = 0;
  let latestSameEkams = false;
  if (ekamsInCookie) {
    const ekamsList = ekamsInCookie.split('|');
    ekamsLength = ekamsList.length;
    const latestIndex = ekamsLength - 1;
    const latestEkams = ekamsList[latestIndex].split('_');
    const [ltEkams] = latestEkams;
    console.log('lt', ltEkams);
    console.log('qe', queryEkams);
    latestSameEkams = ltEkams === queryEkams;
  } else {
    setCookie(advertiserId, 'ekams', cekams);
  }
  console.log(latestSameEkams);

  Object.entries(sendQueryKeyToCookieKey).forEach(
    ([sendQueryKey, cookieKey]) => {
      const cookies = getCookie(advertiserId, cookieKey);
      const [first = NONE, assist = NONE, latest = NONE] = cookies
        ? cookies.split('|')
        : [];
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
      } else if (!latestSameEkams && ekamsLength === 1) {
        changeCookies.push(first);
      }
      changeCookies.push(changeLatestCookie);
      setCookie(advertiserId, cookieKey, changeCookies.join('|'));
    }
  );
  console.log(sendQuery);
  callTrackSever('click', queryString.stringify(sendQuery));
};

export default inflowCall;
