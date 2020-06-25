const subDomain = process.env.CALL === 'beta' ? 'beta.' : 'beta.';

const loadScript = (advertiserId) => {
  const script = document.createElement('script');
  script.src = `http://${subDomain}bid.emforce.co.kr/configExample.js?${advertiserId}`;
  script.type = 'text/javascript';
  script.async = true;
  document.body.appendChild(script);
  // onerror 처리
};

export default (advertiserId) => {
  loadScript(advertiserId);
};
