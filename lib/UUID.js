/* eslint-disable no-bitwise */
const generateUUID = () => {
  let time = new Date().getTime();
  return 'exxxxxxx-mxxx-4xxx-sxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (ch) => {
    const r = (time + Math.random() * 16) % 16 | 0;
    time = Math.floor(time / 16);
    return (ch === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export default generateUUID;
