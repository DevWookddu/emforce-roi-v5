const QUEUE_PREFIX = 'emfV5Queue';

export function getQueue(advertiserId) {
  return (
    JSON.parse(localStorage.getItem(`${QUEUE_PREFIX}.${advertiserId}`)) || []
  );
}

export function setQueue(advertiserId, arr) {
  localStorage.setItem(`${QUEUE_PREFIX}.${advertiserId}`, JSON.stringify(arr));
}

export function clearQueue(advertiserId) {
  localStorage.removeItem(`${QUEUE_PREFIX}.${advertiserId}`);
}
