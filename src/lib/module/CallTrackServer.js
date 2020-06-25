const subDomain = process.env.CALL === 'beta' ? 'beta-' : '';

const callTrackServer = (type, query) => {
  const img = new Image();
  img.src = `http://${subDomain}api.emforce.co.kr/collector/${type}?${query}`;
};

export default callTrackServer;
