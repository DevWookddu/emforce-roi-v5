(function config() {
  if (!window.EmfV5Config) {
    window.EmfV5Config = {};
  }
  window.EmfV5Config[1038] = {
    trackQueryKeyList: [
      [
        'n_ad_group',
        'n_ad',
        'n_mall_pid',
        { key: 'n_campaign_type', exactlyMatch: ['2'] },
      ],
    ],
  };
  window.EmfV5.loadedScript(1038);
})();
