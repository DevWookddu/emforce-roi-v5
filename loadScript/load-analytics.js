/* eslint-disable*/
// w = window
// d = document
// t = tag name
// v = EmfV5
// s = script src
// e = script element
// o = other first script
(function(w, d, t, s, v, e, o){
  if (w.EmfV5)return;
  v=w.EmfV5=function(){v.queue.push(arguments)};
  v.queue=[];
  e=d.createElement(t);
  e.src=s;
  e.async=!0;
  o = d.getElementsByTagName(t)[0];
  o.parentNode.insertBefore(e,o);
})(window, document, 'script', 'https://beta-analytics.emforce.co.kr/conversion/v5/analytics.js');
