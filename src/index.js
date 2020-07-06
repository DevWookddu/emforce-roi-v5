import EmfV5 from './EmfV5';

if (typeof define === 'function' && define.amd) {
  define(() => {
    return EmfV5;
  });
} else if (typeof module === 'object' && module.exports) {
  module.exports = EmfV5;
} else {
  window.EmfV5 = EmfV5;
}
