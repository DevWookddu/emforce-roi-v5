import jsCookie from 'js-cookie';

// .co.kr과 .kr 같은 포함관계는 순서 중요!
const tldList = [
  '.co.kr',
  '.kr',
  '.com',
  '.net',
  '.me',
  '.uk',
  '.jp',
  '.us',
  '.cn',
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

export const setCookie = (advertiserId, cookieKey, value) => {
  jsCookie.set(`emf.${advertiserId}.${cookieKey}`, value, {
    expires: 30,
    domain: getMainDomain(),
  });
};

export const getCookie = (advertiserId, cookieKey) => {
  return jsCookie.get(`emf.${advertiserId}.${cookieKey}`, {
    domain: getMainDomain(),
  });
};