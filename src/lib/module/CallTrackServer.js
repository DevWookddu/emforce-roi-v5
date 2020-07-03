import { EUUID } from '@constant/Common';
import { getCookie } from '@module/HandleCookie';
import EncodeURI from '@util/EncodeURI';
import { API_PATH } from '@constant/ApiURL';

const httpGetCall = (path, queryObject) => {
  const encodedQuery = Object.entries(queryObject).map(([key, value]) => {
    return `${key}=${EncodeURI(JSON.stringify(value))}`;
  });
  const src = `${path}?${encodedQuery.join('&')}`;
  // IE GET Method Request Max Size 2,048 Bytes
  if (src.length < 1024 * 2) {
    return false;
  }
  const img = new Image();
  img.src = src;
  return true;
};

const httpPostCall = (path, queryObject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', path);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.withCredentials = true;
  xhr.send(JSON.stringify(queryObject));
};

const callTrackServer = (type, advertiserId, queryObject) => {
  const path = `${API_PATH}/collector/${type}`;
  const cloneQuery = {
    ...queryObject,
    ctype: 'v5',
    euuid: getCookie(advertiserId, EUUID),
  };

  // Get 방식 호출 불가시에, post 방식 호출
  if (httpGetCall(path, cloneQuery) === false) {
    httpPostCall(path, cloneQuery);
  }
};

export default callTrackServer;
