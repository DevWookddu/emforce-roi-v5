// import jsCookie from 'js-cookie';
import queryString from 'query-string';
import state from '@@state';
import callTrackSever from '../module/CallTrackServer';

const { configs } = state;

const clickCall = (advertiserId, args) => {
  const query = queryString.parse(window.location.search);
  const config = configs[advertiserId];
  console.warn(config);
  console.warn(args);
  if (query.EKAMS) {
    callTrackSever('click', queryString.stringify(query));
  } else if (
    query.n_ad_group &&
    query.n_ad &&
    query.n_mall_pid &&
    query.n_campaign_type === 2
  ) {
    callTrackSever('click', window.location.search);
  }
};

export default clickCall;
