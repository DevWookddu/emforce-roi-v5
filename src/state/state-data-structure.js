export default {
  queue: [],
  scriptLoading: {
    '[advertiser_id]': true,
    1033: true, // 광고주아이디가 키로 있을 경우, 현재 config 스크립트 호출 요청된 상태
  },
  configs: {
    1033: {
      // 광고주별 config script가 로드되었을 시 생성 됨.
      /* ... */
    },
    '[advertiser_id]': {
      requiredInflowQuery: true, // false일 경우, inflow 호출 시, ekams 또는 trackQueryKeyList 상관없이 click 호출
      // emf_duplicate 전달값 체크용 / 초 단위
      duplicateTime: {
        emf_ecommerce: {
          default: 5, // 설정 된 시간 없을 경우 기본 중복 체크 시간
          '[adv_conversion_id]': 10,
          555: 5,
        },
        emf_public: {
          default: 5, // 설정 된 시간 없을 경우 기본 중복 체크 시간
        },
      },
      // 1. 유입시 쿠키에 저장 / 한 요소라도 일치하지 않으면 모두 none 처리
      // 2. 전환시 모든 키값 전달
      trackQueryKeyList: [
        // 각 리스트가 모두 만족해야 쿠키 저장
        [
          { key: 'n_ad_group' },
          { key: 'n_ad' },
          { key: 'n_mall_pid' },
          { key: 'n_campaign_type', exactlyMatch: ['2'] },
        ],
        [
          {
            key: '쿼리키=유입쿼리키',
            sendQueryKey:
              '유입 또는 전환 호출시 전달할 키값(미 선언시 key 이용)',
            cookieKey: '쿠키의 키값으로 이용할 키값(미 선언시 key 이용)',
            // exactlyMatch와 partialMatch가 혼재할 경우, exactlyMatch만 체크
            exactlyMatch: ['완전일치할 경우만'],
            partialMatch: ['정규식 조건', '일반문자열일 경우는 include'],
          },
          { key: 'temp1', partialMatch: [/d+/g, 'tp1'] },
          { key: 'temp2', sendQueryKey: 'temp2s', cookieKey: 'temp2c' },
          { key: 'temp3' },
          { key: 'temp4', exactlyMatch: ['4', '7'] },
        ],
      ],
    },
  },
};
