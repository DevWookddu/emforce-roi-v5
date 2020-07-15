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
  v.setData=function(o){l.setItem(k,s(o));};
  v.getItems=function(){return p(l.getItem(i)||'[]');}
  v.addItem=function(o){var t=v.getItems();t.push(o);l.setItem(i,s(t));};
  v.get=function(){var d=p(l.getItem(k)||'{}');var m=v.getItems();if(m.length){d.order_items=m}return d;};
  v.clear=function(){l.setItem(i,s([]));l.setItem(k,s({}));};
})(window, localStorage, 'EmfV5Data', 'EmfV5Items', JSON.stringify, JSON.parse);

// 기존 저장 된 데이터 모두 제거
EmfV5Storage.clear();

// 커스텀 데이터 저장(덮어씌움)
EmfV5Storage.setData({
  adv_conversion_id: 99,
  total_price: 50000
});

// 아이템 추가
EmfV5Storage.addItem({
  item: '파우더',
  item_category: '화장품',
  item_price: '5000',
  item_quantity: '10'
}); // 상품 추가

// 저장 된 데이터 가져오기
EmfV5Storage.get();

EmfV5('conv', '1234', EmfV5Storage.get());
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
