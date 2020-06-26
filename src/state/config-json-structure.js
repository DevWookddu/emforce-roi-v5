export default {
  requireInflowQuery: true,
  trackQueryKeyList: [
    [
      'n_ad_group',
      'n_ad',
      'n_mall_pid',
      { key: 'n_campaign_type', exactlyMatch: ['2'] },
    ],
  ],
};
