import { helper } from '@ember/component/helper';

export function not(params) {
  for (let i=0, len=params.length; i<len; i++) {
    if (params[i] === true) {
      return false;
    }
  }
  return true;
}

export default helper(not);
