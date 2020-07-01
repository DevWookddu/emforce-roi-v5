import queryString from 'query-string';
import state from '@@state';
import { setCookie, getCookie } from '@module/HandleCookie';
import callTrackSever from '@module/CallTrackServer';
import { NONE, EKAMS } from '@constant/Common';

const { configs } = state;

const inflowCall = (advertiserId /* , args */) => {
  const query = queryString.parse(window.location.search);
  const queryEkams = query.EKAMS;
  const config = configs[advertiserId];
  let sendQuery = {}; // click 서버에 보내는 쿼리 목록
  const sendQueryKeyToCookieKey = {}; // 쿠키 어시스트 조정용

  // ekams의 광고주 id가 inflow의 광고주 id와 다를 경우 호출 안함.
  if (queryEkams && Number(queryEkams.split('.')[1]) !== Number(advertiserId)) {
    return;
  }

  // config에서 trackQueryKeyList의 요소 배열들 중, 이전에 저장된 쿠키의 값들과 같은 경우를 체크하기 위한 변수
  let existTrackQueryOneAllSame = false;

  // inflow 호출 가능한 상태인지
  let isCallCondition = !!queryEkams || config.requiredInflowQuery === false;
  const { trackQueryKeyList } = config;
  trackQueryKeyList.forEach((elmList) => {
    const currentValidateQueryKey = {}; // 보낼 쿼리의 값들을 지정, 하나라도 만족 안할 경우 NONE 처리.
    const allSameValues = []; // 현재 요소 배열의 값이 이전값과 같은지 체크하기 위한 배열
    let isSatisfied = true; // 각 키의 값들이 모두 만족하였는지 판단.
    elmList.forEach((elm) => {
      const { key, exactlyMatch, partialMatch } = elm;
      let { sendQueryKey, cookieKey } = elm;
      sendQueryKey = sendQueryKey || key; // 없을 경우 기본 key 이용
      cookieKey = cookieKey || key; // 없을 경우 기본 key 이용
      sendQueryKeyToCookieKey[sendQueryKey] = cookieKey;
      const value = query[key] || NONE;
      currentValidateQueryKey[sendQueryKey] = value;

      // 이전 값과 비교
      const cookieValue = getCookie(advertiserId, cookieKey);
      if (cookieValue) {
        const latestValue = cookieValue.split('|').pop();
        allSameValues.push(latestValue !== NONE && latestValue === value);
      } else {
        allSameValues.push(false);
      }

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
      // 만족할 경우 inflow 함수 호출하도록 처리.
      isCallCondition = true;
    } else {
      // 하나라도 만족하지 않는 경우가 있다면, 현재 키값 모두 none 처리
      Object.keys(currentValidateQueryKey).forEach((key) => {
        currentValidateQueryKey[key] = NONE;
      });
    }
    if (!existTrackQueryOneAllSame) {
      // 이전 값과 모두 같을 경우, true 처리
      existTrackQueryOneAllSame = allSameValues.every((bool) => bool);
    }
    sendQuery = {
      ...sendQuery,
      ...currentValidateQueryKey,
    };
  });

  if (!isCallCondition) {
    // 만족하는 쿼리가 없을 경우 호출 안함.
    return;
  }

  const currentTime = new Date().getTime();
  const cekams = `${queryEkams || NONE}_${currentTime}`;
  sendQuery.cekams = cekams;
  sendQueryKeyToCookieKey.cekams = EKAMS;
  const ekamsInCookie = getCookie(advertiserId, EKAMS);
  let ekamsLength = 0;
  let isEqualLatest = false;
  let isEqualEkams = false;
  let ltEkams;
  if (ekamsInCookie) {
    const ekamsList = ekamsInCookie.split('|');
    ekamsLength = ekamsList.length;
    const latestIndex = ekamsLength - 1;
    const latestEkams = ekamsList[latestIndex].split('_');
    [ltEkams] = latestEkams;
    isEqualEkams = ltEkams && ltEkams !== NONE && ltEkams === queryEkams;
  } else {
    // ekams 쿠기가 없다는 것은 첫 접근이므로 그냥 저장
    setCookie(advertiserId, EKAMS, cekams);
  }

  if (queryEkams) {
    // 쿼리에 EKAMS가 붙어왔을 경우에만 Ekams로 최근 여부 판단
    isEqualLatest = isEqualEkams;
  } else {
    // 그 외의 경우, 최근의 이캄스가 NONE이면서 쿼리 요소 배열 중 하나라도 만족한 것이 있으면 중복으로 처리.
    isEqualLatest = ltEkams === NONE && existTrackQueryOneAllSame;
  }

  // 각 키별 쿠키 처리
  // 현재가 최근 순서(3번째)에 들어가야하는 경우이나, 첫째와 두번째가 없을 경우 none으로 채움.
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
        if (isEqualLatest) {
          changeCookies.push(assist);
        } else {
          changeCookies.push(latest);
        }
      } else if (ekamsLength === 2) {
        changeCookies.push(first);
        if (!isEqualLatest) {
          changeCookies.push(assist);
        }
      } else if (!isEqualLatest && ekamsLength === 1) {
        changeCookies.push(first);
      }
      changeCookies.push(changeLatestCookie);
      setCookie(advertiserId, cookieKey, changeCookies.join('|'));
    }
  );

  sendQuery.ad = advertiserId;
  sendQuery.ad_ref = document.referrer;
  callTrackSever('click', advertiserId, sendQuery);
};

export default inflowCall;
