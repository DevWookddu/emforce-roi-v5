/* eslint-disable */
(function(w, l, k, i, s, p, v){
  if (w.EmfV5Storage)return;v=w.EmfV5Storage={};
  function merge(a,b){var r=p(s(a||{}));b = b||{};Object.keys(b).forEach(function(c){r[c]=b[c];});return r;}
  v.get=function(){var d=p(l.getItem(k)||'{}');var m=v.getItems();if(m.length){d.order_items=m}return d;};
  v.addData=function(o){l.setItem(k,v.merge(o))};v.addItem=function(o){var t=v.getItems();t.push(o);l.setItem(i,s(t));};
  v.getItems=function(){return p(l.getItem(i)||'[]');};v.merge=function(g){return merge(v.get(),g);}
  v.clear=function(){l.setItem(i,s([]));l.setItem(k,s({}));};
})(window, localStorage, 'EmfV5Data', 'EmfV5Items', JSON.stringify, JSON.parse);

// 기존 저장 된 데이터 모두 제거
EmfV5Storage.clear();

// 커스텀 데이터 저장(같은키는 덮어씌움)
EmfV5Storage.addData({
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

// 스토리지에 저장 된 데이터 가져오기
EmfV5Storage.get();

// 스토리지에 저장 된 데이터와 전달한 객체가 병합 된 데이터 리턴(같은 키는 전달 한 객체 데이터로 변경)
// 스토리지에 변화는 없음.
EmfV5Storage.merge({
  mergeItem: 'ohora'
});

// EmfV5 Use Example
EmfV5('conv', '1234', EmfV5Storage.get());

EmfV5('conv', '1234', EmfV5Storage.merge({
  addData: 'add'
}));