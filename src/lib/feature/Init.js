// import jsCookie from 'js-cookie';
// import queryString from 'query-string';
import state from '@@state';
import errorNotify from '../module/ErrorNotify';
import loadScript from '../module/LoadScript';

export default (advertiserId) => {
  const savedConfigs = state.configs;
  if (!advertiserId) {
    errorNotify('init의 광고주 아이디가 누락되어있습니다.', true);
    return;
  }
  if (savedConfigs[advertiserId]) {
    errorNotify('같은 광고주 아이디로 init이 여러번 호출되었습니다.', true);
    return;
  }
  // const query = queryString.parse(window.location.search);
  // const ekamsInCookie = jsCookie.get('emf.ekams');
  loadScript('http://beta.bid.emforce.co.kr/configExample.js');
};
