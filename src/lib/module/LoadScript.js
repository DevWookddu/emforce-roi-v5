export default (src, callback) => {
  const script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.async = false;
  script.onload = () => {
    if (typeof callback === 'function') {
      callback();
    }
  };
  script.onerror = () => {
    if (typeof callback === 'function') {
      callback();
    }
  };
  document.body.appendChild(script);
};
