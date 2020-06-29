export default {
  requireInflowQuery: true,
  duplicateTime: {
    inflow: {
      default: 5,
    },
    emf_ecommerce: {
      default: 5,
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
  ],
};
