import { EUUID } from '@constant/Common';
import { getCookie } from '@module/HandleCookie';
import EncodeURI from '@util/EncodeURI';

const isBeta = process.env.CALL === 'beta';
const SUB_DOMAIN = isBeta ? 'beta-' : '';

const callTrackServer = (type, advertiserId, queryObject) => {
  const encodedQuery = ['ctype=v5', `euuid=${getCookie(advertiserId, EUUID)}`];
  Object.entries(queryObject).forEach(([key, value]) => {
    encodedQuery.push(`${key}=${EncodeURI(JSON.stringify(value))}`);
  });
  const query = encodedQuery.join('&');
  const src = `https://${SUB_DOMAIN}api.emforce.co.kr/collector/${type}?${query}`;
  if (src.length < 1024 * 2) {
    const img = new Image();
    img.src = src;
  } else {
    // ajax POST
  }
};

export default callTrackServer;
