/* eslint-disable */
// w = window
// l = localStorage
// k = data key
// i = items key
// s = JSON.stringify
// p = JSON.parse
// v = EmfV5Storage
(function(w, l, k, i, s, p, v){
  if (w.EmfV5Storage)return;v=w.EmfV5Storage={};
  function merge(a,b){var r = p(s(a||{}));Object.keys(b).forEach(function(c){r[c]=b[c];});return r;}
  v.get=function(){var d=p(l.getItem(k)||'{}');var m=v.getItems();if(m.length){d.order_items=m}return d;};
  v.addData=function(o){l.setItem(k,v.merge(o))};
  v.addItem=function(o){var t=v.getItems();t.push(o);l.setItem(i,s(t));};
  v.getItems=function(){return p(l.getItem(i)||'[]');};
  v.merge=function(g){return merge(v.get(),g);}
  v.clear=function(){l.setItem(i,s([]));l.setItem(k,s({}));};
})(window, localStorage, 'EmfV5Data', 'EmfV5Items', JSON.stringify, JSON.parse);
