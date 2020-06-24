import jsCookie from 'js-cookie';
import queryString from 'query-string';
import state from '@@state';
import errorNotify from '../module/ErrorNotify';

const checkEKAMS = ({ EKAMS }) => {
  const ekamsInCookie = jsCookie.get('emf.ekams');
  console.log(ekamsInCookie);
  console.log(EKAMS);
};

export default (advertiserId) => {
  const query = queryString.parse(window.location.search);
  checkEKAMS(query);
  // const ekamsInCookie = jsCookie.get('emf.ekams');
  const advertiserIdInCookie = jsCookie.get('emf.advertiser_id');
  if (state.advertiserId) {
    errorNotify('엠포스 트래킹 초기화 함수가 중복으로 선언되어 있습니다.');
  } else {
    state.advertiserId = advertiserId || '';
  }
  // loadScript('주소', callback);
  console.error(advertiserIdInCookie);
  console.error(advertiserId);
};
