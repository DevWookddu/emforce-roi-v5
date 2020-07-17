import { EKAMS, NONE } from '@constant/Common';
import { getCookie } from '@module/HandleCookie';
import errorNotify from '@module/ErrorNotify';
import callCollectorServer from '@module/CallCollectorServer';
import state from '@@state';

const { configs } = state;

const DUPL_PREFIX = 'emfV5AdvConvId';

const isDuplicateConv = (config, emfCampaign, advConversionId, currentTime) => {
  const duplTimeObjByCampaignType = config?.duplicateTime[emfCampaign] || {};
  const defaultDuplTime = duplTimeObjByCampaignType.default || 5;
  const duplTimeByAdvConversionId = duplTimeObjByCampaignType[advConversionId];
  const duplStorageKey = `${DUPL_PREFIX}.${advConversionId}`;
  const prevConvTime = localStorage.getItem(duplStorageKey);
  if (
    prevConvTime &&
    (currentTime - Number(prevConvTime)) / 1000 <
      (duplTimeByAdvConversionId || defaultDuplTime)
  ) {
    return true;
  }
  localStorage.setItem(duplStorageKey, currentTime);
  return false;
};

const convCall = (advertiserId, args) => {
  const config = configs[advertiserId];
  const {
    emf_campaign: emfCampaign,
    adv_conversion_id: advConversionId,
  } = args;

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
  sendQuery.emf_duplicate = isDuplicateConv(
    config,
    emfCampaign,
    advConversionId,
    currentTime
  );
  callCollectorServer('conv', advertiserId, sendQuery);
};

export default convCall;
