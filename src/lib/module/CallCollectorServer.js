import { EUUID } from '@constant/Common';
import { getCookie } from '@module/HandleCookie';
import EncodeURI from '@util/EncodeURI';
import { API_PATH } from '@constant/ApiURL';

const httpGetCall = (path, queryObject) => {
  const encodedQuery = Object.entries(queryObject).map(([key, value]) => {
    return `${key}=${EncodeURI(JSON.stringify(value))}`;
  });
  const src = `${path}?${encodedQuery.join('&')}`;
  const img = new Image();
  img.src = src;
};

const httpPostCall = (path, queryObject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', path);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.withCredentials = true;
  xhr.send(JSON.stringify(queryObject));
};

const callCollectorServer = (type, advertiserId, queryObject) => {
  const path = `${API_PATH}/collector/${type}`;
  const cloneQuery = {
    ...queryObject,
    ctype: 'v5',
    euuid: getCookie(advertiserId, EUUID),
  };
  switch (type) {
    case 'conv':
      httpPostCall(path, cloneQuery);
      break;
    case 'click':
    default:
      httpGetCall(path, cloneQuery);
  }
};

export default callCollectorServer;
