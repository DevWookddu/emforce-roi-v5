let advertiserId;
let EKAMS;
const state = {
  queue: [],
};

Object.defineProperties(state, {
  advertiserId: {
    set(value) {
      if (advertiserId) {
        return;
      }
      advertiserId = value;
    },
    get() {
      return advertiserId;
    },
  },
  EKAMS: {
    set(value) {
      EKAMS = value;
    },
    get() {
      return EKAMS;
    },
  },
});

export default state;
