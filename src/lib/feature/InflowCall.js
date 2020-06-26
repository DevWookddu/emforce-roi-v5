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

const inflowCall = (advertiserId /* , args */) => {
  const query = queryString.parse(window.location.search);
  const queryEkams = query.EKAMS;
  const config = configs[advertiserId];

  const sendQuery = {};
  let isCallCondition = !!queryEkams || config.requireInflowQuery === true;
  const { trackQueryKeyList } = config;
  trackQueryKeyList.forEach((elmList) => {
    const isSatisfied = elmList.every((elm) => {
      if (typeof elm === 'string') {
        const value = query[elm];
        sendQuery[elm] = value;
        return value;
      }
      const { key, sendQueryKey, exactlyMatch, partialMatch } = elm;
      const value = query[key];
      sendQuery[sendQueryKey || key] = value;
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

  Object.keys(sendQuery).forEach((key) => {
    if (!sendQuery[key]) {
      sendQuery[key] = 'none';
    }
  });

  const changeCookies = [];
  const currentTime = new Date().getTime();
  const ekamsInCookie = jsCookie.get(`emf.${advertiserId}.ekams`);
  const cekams = `${queryEkams || 'none'}_${currentTime}`;
  sendQuery.cekams = cekams;
  if (!ekamsInCookie) {
    changeCookies.push(cekams);
  } else {
    const [first, assist, latest] = ekamsInCookie.split('|');
    if (latest) {
      const [latestEkams] = latest.split('_');
      if (latestEkams !== 'none' && latestEkams === queryEkams) {
        changeCookies.splice(0, 3, first, assist, cekams);
      } else {
        changeCookies.splice(0, 3, first, latest, cekams);
      }
    } else if (assist) {
      const [assistEkams] = assist.split('_');
      if (assistEkams !== 'none' && assistEkams === queryEkams) {
        changeCookies.splice(0, 2, first, cekams);
      } else {
        changeCookies.splice(0, 2, first, assist, cekams);
      }
    } else {
      const [firstEkams] = first.split('_');
      if (firstEkams !== 'none' && firstEkams === queryEkams) {
        changeCookies.splice(0, 1, cekams);
      } else {
        changeCookies.splice(0, 1, first, cekams);
      }
    }
  }
  callTrackSever('click', queryString.stringify(sendQuery));
};

export default inflowCall;
