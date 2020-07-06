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
