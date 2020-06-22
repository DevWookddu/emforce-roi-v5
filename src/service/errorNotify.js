const errorNotify = (message) => {
  if (document && document.body) {
    const elm = document.createElement('div');
    elm.innerText = message;
    elm.style.fontSize = '18px';
    elm.style.color = '#de1313';
    document.body.prepend(elm);
  }
  if (console) {
    console.error(`[Emforce Tracking Error]: ${message}`);
  }
};

export default errorNotify;
