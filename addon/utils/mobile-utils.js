export function isTouchDevice() {
  if ('callPhantom' in window){
    //if running PhantomJS tests, make this a non-touch device
    return false;
  }
  return (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0));
}
