import EncodeURI from '../utils/EncodeURI';

const subDomain = process.env.CALL === 'beta' ? 'beta-' : '';

const callTrackServer = (type, queryObject) => {
  const img = new Image();
  const encodedQuery = ['ctype=v5'];
  Object.entries(queryObject).forEach(([key, value]) => {
    encodedQuery.push(`${key}=${EncodeURI[value]}`);
  });
  const query = encodedQuery.join('&');
  img.src = `http://${subDomain}api.emforce.co.kr/collector/${type}?${query}`;
};

export default callTrackServer;
