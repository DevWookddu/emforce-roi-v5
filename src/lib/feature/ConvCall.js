import sha256 from 'sha256';
import { EKAMS, NONE, ADV_CONV_ID_PREFIX } from '@constant/Common';
import { getCookie } from '@module/HandleCookie';
import errorNotify from '@module/ErrorNotify';
import callCollectorServer from '@module/CallCollectorServer';
import state from '@@state';

const { configs } = state;

const isDuplicateConv = ({
  config,
  emfCampaign,
  advConversionId,
  allekams,
  argsString,
  currentTime,
}) => {
  const duplTimeObjByCampaignType = config?.duplicateTime[emfCampaign] || {};
  const defaultDuplTime = duplTimeObjByCampaignType.default || 5;
  const duplTimeByAdvConversionId = duplTimeObjByCampaignType[advConversionId];
  const emfV5ConvIdKey = `${ADV_CONV_ID_PREFIX}.${advConversionId}`;
  const convTimeData = JSON.parse(localStorage.getItem(emfV5ConvIdKey) || '{}');
  const allEkams = allekams
    .split('|')
    .map((ekams) => ekams.split('_')[0]) // 시간 제거
    .join('|');
  const toSha256String = sha256(`${allEkams}_${argsString}`);
  const prevConvTime = convTimeData[toSha256String];
  if (
    prevConvTime &&
    (currentTime - Number(prevConvTime)) / 1000 <
      (duplTimeByAdvConversionId || defaultDuplTime)
  ) {
    return true;
  }
  convTimeData[toSha256String] = currentTime;
  localStorage.setItem(emfV5ConvIdKey, JSON.stringify(convTimeData));
  return false;
};

const convCall = (advertiserId, args) => {
  const config = configs[advertiserId];
  const argsString = JSON.stringify(args);
  const {
    emf_campaign: emfCampaign,
    adv_conversion_id: advConversionId,
  } = args;

  if (!emfCampaign) {
    errorNotify('emf_campaign이 누락되었습니다.');
    return;
  }

  if (!advConversionId) {
    errorNotify('adv_conversion_id가 누락되었습니다.');
    return;
  }

  const sendQuery = {
    ...args,
    emf_campaign: emfCampaign,
    adv_conversion_id: advConversionId,
  };

  const currentTime = new Date().getTime();
  const ekamsInCookie = getCookie(advertiserId, EKAMS);
  let ekams;
  let allekams;
  if (ekamsInCookie) {
    ekams = ekamsInCookie.split('|').pop();
    allekams = ekamsInCookie;
  } else {
    ekams = `${NONE}_${currentTime}`;
    allekams = ekams;
  }

  config.trackQueryKeyList.forEach((elmList) => {
    elmList.forEach((elm) => {
      const { key, sendQueryKey, cookieKey } = elm;
      sendQuery[sendQueryKey || key] =
        getCookie(advertiserId, cookieKey || key) || NONE;
    });
  });

  sendQuery.adv_id = advertiserId;
  sendQuery.ekams = ekams;
  sendQuery.allekams = allekams;
  sendQuery.emf_duplicate = isDuplicateConv({
    config,
    emfCampaign,
    advConversionId,
    allekams,
    argsString,
    currentTime,
  });
  callCollectorServer('conv', advertiserId, sendQuery);
};

export default convCall;
