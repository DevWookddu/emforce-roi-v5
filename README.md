# eMFORCE ROI V5

> eMFORCE Tracking Script V5

## Install

```
npm install emforce-roi-v5
```

## IE 지원

> IE 10 이상부터 지원됩니다. 이전 버전은 구버전 스크립트를 이용해주세요.

## UMD

> UMD Support

## Load

비동기

```js
(function(w,d,t,s,v,e,o){
if (w.EmfV5)return;v=w.EmfV5=function(){v.queue.push(arguments)};
v.queue=[];e=d.createElement(t);e.src=s;e.async=!0;
o=d.getElementsByTagName(t)[0];o.parentNode.insertBefore(e,o);
})(window, document, 'script', 'https://analytics.emforce.co.kr/conversion/v5/analytics.js');
```

모듈

```js
// commonjs
const EmfV5 = require('emforce-roi-v5');
// or es6
import EmfV5 from 'emforce-roi-v5';
// or global => window.EmfV5
import 'emforce-roi-v5';
```

## 호출 방식

```js
// 유입
EmfV5('inflow', '[advertiser_id]');

// 전환
EmfV5('conv', '[advertiser_id]', { ... });
```

## Get

```js
// 광고주 ID
EmfV5.advId; // String

// UUID
EmfV5.getEUUID(advertiserId); // String
```

## Use Storage

```js
(function(w, l, k, i, s, p, v){
  if (w.EmfV5Storage)return;v=w.EmfV5Storage={};
  function merge(a,b){var r=p(s(a||'{}'));Object.keys(b).forEach(function(c){r[c]=b[c];});return r;}
  v.get=function(){var d=p(l.getItem(k)||'{}');var m=v.getOrderItems();if(m.length){d.order_items=m}return d;};
  v.addData=function(o){l.setItem(k,s(v.merge(o)))};v.addOrderItem=function(o){var t=v.getOrderItems();t.push(o);l.setItem(i,s(t));};
  v.getOrderItems=function(){return p(l.getItem(i)||'[]');};v.merge=function(g){return merge(v.get(),g);}
  v.clear=function(){l.setItem(i,s([]));l.setItem(k,s({}));};
})(window, localStorage, 'EmfV5Data', 'EmfV5Items', JSON.stringify, JSON.parse);

// 기존 저장 된 데이터 모두 제거
EmfV5Storage.clear();

// 커스텀 데이터 저장(같은키는 덮어씌움)
EmfV5Storage.addData({
  adv_conversion_id: 99,
  total_price: 50000
});

// 상품 추가
EmfV5Storage.addOrderItem({
  item_id : '{상품 ID}',         // 상품 ID - 옵션
  item_name: '{상품명}',         // 상품명 - 옵션
  item_category: '{카테고리}',   // 상품 카테고리 - 옵션
  item_quantity: '{구매수량}',   // 구매 수량 - 옵션
  item_price: '{구매금액}',      // 구매 금액 - 옵션
}); // 상품 추가

// 스토리지에 저장 된 데이터 가져오기
EmfV5Storage.get();

// 스토리지에 저장 된 데이터와 전달한 객체가 병합 된 객체 리턴(같은 키는 전달 한 객체 데이터로 변경)
// 스토리지에 변화는 없음.
EmfV5Storage.merge({
  new_key: 'new',
  total_price: 70000
});

// EmfV5 Use Example
EmfV5('conv', '1234', EmfV5Storage.get());

EmfV5('conv', '1234', EmfV5Storage.merge({
  new_data: 'merge'
}));
```

## Command

```
// dev
npm run dev

// script async load test
npm run test

// build
npm run build:[beta|prod]

// upload
npm run upload:[beta|prod]
```

## AWS Config

```
// aws upload config file
.env.aws

// content
aws_access_key_id=ABCDEFGHIJKLMNOPQRSTUVWXYZ
aws_secret_access_key=ABCDEFGHIJKLMNOPQRSTUVWXYZ
```

## 사용 문의

[엠포스(http://www.emforce.co.kr)](http://www.emforce.co.kr)
