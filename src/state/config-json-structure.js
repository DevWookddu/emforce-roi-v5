export default {
  requireInflowQuery: true,
  duplicateTime: {
    emf_ecommerce: {
      default: 5,
      555: 5,
      // [adv_conversion_id]: 5,
    },
    emf_public: {
      default: 5,
    },
  },
  trackQueryKeyList: [
    [
      { key: 'n_ad_group' },
      { key: 'n_ad' },
      { key: 'n_mall_pid' },
      { key: 'n_campaign_type', exactlyMatch: ['2'] },
    ],
    [
      { key: 'temp1', partialMatch: [/d+/g, 'tp1'] },
      { key: 'temp2', sendQueryKey: 'temp2s', cookieKey: 'temp2c' },
      { key: 'temp3' },
      { key: 'temp4', exactlyMatch: ['4', '7'] },
    ],
  ],
};
