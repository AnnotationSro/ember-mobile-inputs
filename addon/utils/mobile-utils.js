export function isTouchDevice() {
  if ('callPhantom' in window){
    //if running PhantomJS tests, make this a non-touch device
    return false;
  }
  return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}
