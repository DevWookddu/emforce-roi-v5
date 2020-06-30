import { EUUID } from '@constant/Common';
import { getCookie } from '@module/HandleCookie';
import EncodeURI from '@util/EncodeURI';

const SUB_DOMAIN = process.env.CALL === 'beta' ? 'beta-' : '';

const callTrackServer = (type, advertiserId, queryObject) => {
  const img = new Image();
  const encodedQuery = ['ctype=v5', `euuid=${getCookie(advertiserId, EUUID)}`];
  Object.entries(queryObject).forEach(([key, value]) => {
    encodedQuery.push(`${key}=${EncodeURI(JSON.stringify(value))}`);
  });
  const query = encodedQuery.join('&');
  img.src = `http://${SUB_DOMAIN}api.emforce.co.kr/collector/${type}?${query}`;
};

export default callTrackServer;
