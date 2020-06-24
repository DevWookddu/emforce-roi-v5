const errorNotify = (message, prependBody = false) => {
  if (document && document.body) {
    const elm = document.createElement('div');
    elm.innerText = message;
    elm.style.fontSize = '18px';
    elm.style.color = '#de1313';
    if (prependBody) {
      document.body.prepend(elm);
    }
  }
  console.error(`[Emforce Tracking Error]: ${message}`);
};

export default errorNotify;
