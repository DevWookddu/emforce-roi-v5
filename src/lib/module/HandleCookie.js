import jsCookie from 'js-cookie';

// .or.kr, .co.kr과 .kr 같은 포함관계는 순서 중요!
const tldList = [
  '.ac.kr',
  '.go.kr',
  '.or.kr',
  '.co.kr',
  '.kr',
  '.com',
  '.net',
  '.me',
  '.uk',
  '.jp',
  '.us',
  '.cn',
  '.org',
  '.gov',
  '.edu',
  '.info',
  '.biz',
];

const getMainDomain = () => {
  const { hostname } = window.location;
  const findedTld = tldList.find((tld) => hostname.includes(tld));
  const hostnameWithoutTld = hostname.substr(
    0,
    hostname.length - findedTld.length
  );
  const lastDotIndex = hostnameWithoutTld.lastIndexOf('.');
  const includeDot = lastDotIndex > -1;
  return includeDot ? hostname.substr(lastDotIndex) : `.${hostname}`;
};

export const setCookie = (advertiserId, cookieKey, value, option = {}) => {
  jsCookie.set(`emf.${advertiserId}.${cookieKey}.v5`, value, {
    expires: 30,
    domain: getMainDomain(),
    ...option,
  });
};

export const getCookie = (advertiserId, cookieKey) => {
  return jsCookie.get(`emf.${advertiserId}.${cookieKey}.v5`, {
    domain: getMainDomain(),
  });
};

export const getEkamsCookiesJson = () => {
  return Object.entries(jsCookie.get() || {})
    .filter(([key]) => key.includes('ekams'))
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});
};
