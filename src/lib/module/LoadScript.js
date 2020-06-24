export default (src) => {
  const script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';
  script.async = true;
  document.body.appendChild(script);
};
