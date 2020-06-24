/* eslint-disable */
(function(window) {
  'use strict';
  
    // 변수 선언
    var document = window.document,
        navigator = window.navigator,
        location = window.location;
  
    var root = window;
  
    var cookieQueueCount = 6;   // EKMAS 키값 누적 횟수 정의
    var trackingDays = 30;      // EKMAS 키값 유효 기간 (일수)  기본값
    var cookieExpireDays = 30;  // 쿠키 저장 일수 기본값
    var trackingDomain = multiDomain(document.domain);   // 쿠키에 저장할 도메인 가져오기 함수 실행
  
    // LP url에서 파라미터 값에서 value 값 가져오기
    var query = {};
    query['ekams'] = getParseQueryValue(location.href, 'EKAMS', '&');     // 파라미터 값에서 ekams 값 가져오기
    query['trackingDays'] = getParseQueryValue(location.href, 'trackingDays', '&');  // 파라미터 값에서 EKMAS 키값 유효 기간 가져오기
    query['cookieExpireDays'] = getParseQueryValue(location.href, 'cookieExpireDays', '&'); // 파라미터 값에서 쿠키 저장 일수 가져오기
    query['trackingDays'] = query['trackingDays'] ? Number(query['trackingDays']) : trackingDays; // EKMAS 키값 유효 기간 에서 기본값으로 대체 여부 판단하기
    query['cookieExpireDays'] = query['cookieExpireDays'] ? Number(query['cookieExpireDays']) : cookieExpireDays; // 쿠키 저장 일수 기본값으로 대체 여부 판단하기
  
    var neoAdvertiserId = getAdvertiserId();  // EKMAS 키값 에서 `광고주 번호 가져오기` 함수 실행 해서 광고주 번호 가져오기
    var ekamsCookieName, medsCookieName;  // ekams 키값을 저장하는 쿠키명, 검색 미디어 값을 저장하는 쿠키명 변수 선언
  
    if(neoAdvertiserId) {
      ekamsCookieName = 'emf.' + neoAdvertiserId + '.ekams';   // ekams 키값을 저장하는 쿠키명
      medsCookieName = 'emf.' + neoAdvertiserId + '.meds';     // 검색 미디어 값을 저장하는 쿠키명
    }
    /*
      check parameter
      ekams 쿠키를 저정하는 조건
    */
    if (query['ekams'] !== '' && query['ekams'] !== undefined && neoAdvertiserId !== '' && neoAdvertiserId !== undefined) {
      makeCookie(cookieQueueCount);
  
    }
  
    // 함수 : `서브 도메인 값에서 루트 도메인값 추출하기 함수 `
    function multiDomain(dd) {
      var s = dd.split(".");
      if (s.length == 3) {
        if (s[1].length == 2) {
          return dd;
        } else {
          return s[1] + "." + s[2];
        }
      } else if (s.length > 3) {
        if (s[s.length-2].length == 2) {
          return s[s.length-3] + "." + s[s.length-2] + "." + s[s.length-1];
        } else {
          return s[s.length-2] + "." + s[s.length-1];
        }
      } else {
        return dd;
      }
    }
  
    // 함수 : `서브 도메인 추출하기`
    function getSubDomain(rf) {
      var start = rf.indexOf('//');
      var end = rf.substring(start+2, rf.length).indexOf('/');
      return (rf.substring(start+2, start+2+end));
    }
  
    // 함수 : `광고주 번호 가져오기`
    function getAdvertiserId() {
      if(query['ekams'] !== '' && query['ekams'] !== undefined) {
        return query['ekams'].split('.')[1];
      }else {
        return;
      }
    }
  
    // 함수 : `ULR 값에서 파라미터 Key 의 Value 를 추출하는 함수`
    function getParseQueryValue(q, key, delimiter) {
  
      key = key + '=';
  
      if(q.indexOf(key) < 0) return '';
  
      if(q.indexOf('?' + key) > 0){
        key = '?' + key;
      }
      if(q.indexOf('&' + key) > 0){
        key = '&' + key;
      }
      var s_idx = q.indexOf(key) + (key.length);
      var value = q.substr(s_idx, q.length - s_idx);
      var e_idx = s_idx + value.indexOf(delimiter);
  
      if(e_idx >= s_idx) {
        value = q.substr(s_idx, e_idx - s_idx);
      }
      return value;
    }
  
    // 함수 : `시간값을 Long 형 값으로 변환 하기 `
    function getEpochTime(type) {
      var todayDate = new Date();
  
      if(type == 'ekams') {
  
        // EKMAS 키값 유효 기간 만큼 더한후 Long 형 값으로 변환 하기
        todayDate.setDate(todayDate.getDate() + query['trackingDays']);
        return parseInt(todayDate.getTime() / 1000,10);
      }else if(type == 'meds') {
  
        //현재 시간값을 Long 형 값으로 변환 하기
        todayDate.setDate(todayDate.getDate());
        return parseInt(todayDate.getTime() / 1000,10);
      }
    }
  
    // 함수 : `쿠키값에서 이름에 해당된는 Value 값 거져오기 `
    function getCookie(name) {
      var cookieValue = getParseQueryValue(document.cookie,name,';');
  
      if(cookieValue !== undefined && cookieValue !== '') {
        return getParseQueryValue(document.cookie,name,';');
      }else {
        return;
      }
    }
  
  
    // 함수 : `쿠키값 저장하기 `
    function setCookie(name, value, expiredays, dateType) {
      var todayDate = new Date();
  
      todayDate.setDate(todayDate.getDate() + expiredays);
      document.cookie = name + '=' + value + '; path=/; domain=' + trackingDomain + '; expires=' + todayDate.toGMTString() + ';';
      //local storage
      try{
        var memory = window.localStorage || (window.UserDataStorage && new UserDataStorage()) || new CookieStorage();
        memory.setItem(name,value);
      }catch(ex){
  
      }
    }
  
    // 함수 : `유틸 기존 배열값에 신규 값 배열에 추가`
    function assembleCookie(oldArr, currentStr) {
      var value = [];
  
      var oldArrLen = oldArr.length;
  
      if(oldArrLen < cookieQueueCount) {
        value = oldArr;
      }else {
        for(var i=0;i<oldArrLen-1;i++) {
          value.push(oldArr[i+1]);
        }
      }
      value.push(currentStr);
  
      return value;
    }
  
    // 함수 : `유틸 배열값에 구분자 | 추가 해서 String 타입으로 반환`
    function getStringFromArray(arr) {
      var valueStr = '';
  
      for(var i=0;i<arr.length;i++) {
        if(i===0) {
          valueStr = arr[i];
        }else {
          valueStr += '|' + arr[i];
        }
      }
      return valueStr;
    }
  
    // 함수 : `한글 등 키값을 encoding utf-8 작업`
    function encodeURL(str){
      if (str !== '' && str !== undefined ){
        var s0, i, s, u;
        s0 = "";                // encoded str
        for (i = 0; i < str.length; i++){   // scan the source
          s = str.charAt(i);
          u = str.charCodeAt(i);          // get unicode of the char
          if (s == " "){
            s0 += "+"; // SP should be converted to "+"
          }else{
            if ( u == 0x2a || u == 0x2d || u == 0x2e || u == 0x5f || ((u >= 0x30) && (u <= 0x39)) || ((u >= 0x41) && (u <= 0x5a)) || ((u >= 0x61) && (u <= 0x7a))){       // check for escape
            s0 = s0 + s; // don't escape
            }else { // escape
              if ((u >= 0x0) && (u <= 0x7f)){     // single byte format
                s = "0"+u.toString(16);
                s0 += "%"+ s.substr(s.length-2);
              }else if (u > 0x1fffff){     // quaternary byte format (extended)
                s0 += "%" + (oxf0 + ((u & 0x1c0000) >> 18)).toString(16);
                s0 += "%" + (0x80 + ((u & 0x3f000) >> 12)).toString(16);
                s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
                s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
              }else if (u > 0x7ff){        // triple byte format
                s0 += "%" + (0xe0 + ((u & 0xf000) >> 12)).toString(16);
                s0 += "%" + (0x80 + ((u & 0xfc0) >> 6)).toString(16);
                s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
              }else {                      // double byte format
                s0 += "%" + (0xc0 + ((u & 0x7c0) >> 6)).toString(16);
                s0 += "%" + (0x80 + (u & 0x3f)).toString(16);
              }
            }
          }
        }
        return s0;
      }else{
        return '';
      }
    }
  
    // 함수 : `레퍼러 url(검색광고) 에서 검색어 키워드 값을 가져오기`
    function getSearchKeyword() {
      var searchEngine = {
        'www.google.co.kr' : 'q',
        'www.google.com' : 'q',
        'search.naver.com' : 'query',
        'ad.search.naver.com' : 'query',
        'm.search.naver.com' : 'query',
        'm.ad.search.naver.com' : 'query',
        'search.daum.net' : 'q',
        'm.search.daum.net' : 'q',
        'kr.search.yahoo.com' : 'p',
        'livesearch.msn.co.kr' : 'q',
        'search.nate.com' : 'q',
        'm.search.nate.com' : 'q',
        'powersearch.korea.com' : 'query',
        'search.chol.com' : 'q',
        'm.chol.com' : 'keyword',
        'search.dreamwiz.com' : 'sword',
        'm.dreamwiz.com' : 'sword',
        'find.joins.com' : 'q',
        'search.zum.com' : 'query',
        'm.search.zum.com' : 'query',
        //test
        'dev.facebook.emforce.co.kr:8080' : 'q',
        'media.a3tio.com' : 'query'
      };
  
      //
      var rfd = getRfd();
          console.log(rfd);
      var attr = searchEngine[rfd];
      if(attr !== '' && attr !== undefined) {
        var topRef = top.document.referrer;
        return getParseQueryValue(topRef, attr, '&');
      }else {
        return '';
      }
    }
  
    // 함수 : `불필요한 값 제거 하기`
    function keywordFilter(key, before, after){
      if (key !== '' && key !== undefined) {
        key = key.split(before).join(after);
      }
      return key;
    }
  
    // 함수 : 쿠키에 저장된 미디어값을 만드는 작업 [광고매체도메인.키워드]
    function getMedsCookie(kwd) {
      var value = '';
  
      var rfd = getRfd();
      var keyword = encodeURL(kwd);
      var matchType = keywordFilter(rfd, '.', '_');
  
      if(keyword !== '' && keyword !== undefined) {
        keyword = keywordFilter(keyword, '.', '');
        keyword = keywordFilter(keyword, '%7C', '');
      } else {
        keyword = 'NOSEARCH';
      }
      value = matchType + '.' + keyword;
  
      return value;
    }
  
  
    // 함수 : `newMedsCookieValue 정보를 받아서 클릭 수집 서비스에 필요한 정보를 전달` ,
    function clickCall(newMedsCookieValue) {
      var protocol = 'https://';
      var clickServerUrl = 'click.emforce.co.kr/click.emf';
  
      var cekams = query['ekams'] + '.' + getEpochTime('ekams');
  
      var searchKeyword = getSearchKeyword();    // 검색 키워드 정보
  
      var clickServerUrl2 = 'api.emforce.co.kr/collector/click'; // 클릭 수집 서비스 URL 정보
      var cekams2 = query['ekams'] + '.' + getEpochTime('ekams'); // 이캅스 키값 + trackingDays 된 값
      var searchKeyword2 = getSearchKeyword();   // 검색 키워드 정보
  
      var clickUrl2 = protocol + clickServerUrl2 +
      '?ad=' + neoAdvertiserId +
      '&cekams=' + encodeURL(cekams) +
      '&allekams=' + encodeURL(cekams) +
      '&pg=false&ctype=nt' +
      '&scrk=' + encodeURL(searchKeyword2) +
      '&neo=' + encodeURL(newMedsCookieValue)+
      '&euuid=' + generateUUID();
  
      // 이미지 형태로 Get 방식으로 정보 전달 하기
      var clickImage2 = new Image();
      clickImage2.src = clickUrl2;
  
  
      var clickUrl = protocol + clickServerUrl +
      '?ad=' + neoAdvertiserId +
      '&cekams=' + cekams +
      '&allekams=' + cekams +
      '&pg=false&ctype=ot' +
      '&scrk=' + encodeURL(searchKeyword) +
      '&neo=' + newMedsCookieValue;
  
      var clickImage = new Image();
      clickImage.src = clickUrl;
  
  
  
    }
  
      function generateUUID() {
      var d = new Date().getTime();
      var uuid = 'exxxxxxx-mxxx-4xxx-sxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
      });
      return uuid;
    }
  
    // 함수 : `레퍼러 도에인 가져오기  --> 레퍼러 값을 가져오지 못할 경우 파라미터 값으로 레퍼러 값을 받은것을 처리하는 작업`
    function getRfd() {
      var value = '';
  
      var rf = document.referrer;
      var rfd = '';
      /* no ref media */
      if(rf === '' || rf === undefined){
        var param = location.href;
        if(param.indexOf('_caosrefdm') > -1) {
          rfd = getParseQueryValue(param, '_caosrefdm', '&');
        }else {
          rfd = 'NOREF';
        }
      }else {
        rfd = getSubDomain(rf);
      }
  
      value = rfd;
  
      return value;
    }
  
    // 함수 : `에포스 쿠키에 저장할 값을 만드는 작업`
    function makeCookie(maxCnt) {
      /*
        1. cookie => emf.{id}.ekams
      */
      var epochTimeForEkams = getEpochTime('ekams');
      var oldEkamsCookie = getCookie(ekamsCookieName);
      var newEkamsCookieValue = '';
      var newEkamsCookieValueArr = [];
  
      /*
        2. cookie => emf.{id}.meds
        search_url.keyword.localTime
      */
  
      var epochTimeForMeds = getEpochTime('meds');
      var oldMedsCookie = getCookie(medsCookieName);
  
      var searchKeyword = getSearchKeyword();
      var newMedsCookieValue = encodeURIComponent(getMedsCookie(searchKeyword));
      var newMedsCookieValueArr = [];
  
      if(oldEkamsCookie === '' || oldEkamsCookie === undefined) {
        newEkamsCookieValue = query['ekams'] + '.' + epochTimeForEkams;
        newMedsCookieValue += '.' + epochTimeForMeds;
      }else {
          var oldEkamsCookieArr = oldEkamsCookie.split('|');
          var lastEkamsCookie = oldEkamsCookieArr[oldEkamsCookieArr.length-1];
  
          var oldMedsCookieArr = oldMedsCookie.split('|');
  
          if(lastEkamsCookie.indexOf(query['ekams']) > -1) {
            oldEkamsCookieArr[oldEkamsCookieArr.length-1] = query['ekams'] + '.' + epochTimeForEkams;
            oldMedsCookieArr[oldMedsCookieArr.length-1] = newMedsCookieValue + '.' + epochTimeForMeds;
  
            newEkamsCookieValueArr = oldEkamsCookieArr;
            newMedsCookieValueArr = oldMedsCookieArr;
          }else {
            var currentEkamsCookieValue = query['ekams'] + '.' + epochTimeForEkams;
            newEkamsCookieValueArr = assembleCookie(oldEkamsCookieArr,currentEkamsCookieValue);
  
            var currentMedsCookieValue = newMedsCookieValue + '.' + epochTimeForMeds;
            newMedsCookieValueArr = assembleCookie(oldMedsCookieArr, currentMedsCookieValue);
          }
          newEkamsCookieValue = getStringFromArray(newEkamsCookieValueArr);
          newMedsCookieValue = getStringFromArray(newMedsCookieValueArr);
      }
      clickCall(newMedsCookieValue);  // 광고 클릭후 최초 도달 시 작동하기 때문에 클릭 정보를 전달하는 함수 호출
      setCookie(ekamsCookieName, newEkamsCookieValue, query['cookieExpireDays']);
      setCookie(medsCookieName, newMedsCookieValue, query['cookieExpireDays']);
    }
  })(window);
  