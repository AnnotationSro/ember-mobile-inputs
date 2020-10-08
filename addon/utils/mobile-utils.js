import {
  get
} from '@ember/object';

export function isTouchDevice() {
  if ('callPhantom' in window) {
    //if running PhantomJS tests, make this a non-touch device
    return false;
  }
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

export function getWithDefault(obj, key, defaultValue) {
  let result = get(obj, key);
  if (typeof result === 'undefined') {
    result = defaultValue;
  }
  return result;
}
