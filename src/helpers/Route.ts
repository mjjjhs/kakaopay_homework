import {ERoute} from "../enums/Config";
import Game from "../layouts/Game";
import GameResult from "../layouts/GameResult";

const CheckedRouteResultHash = (): boolean => {
  return window.location.hash.replace('#', '') !== ERoute.RESULT;
};
const CheckedOtherThanRouteHash = (hashStr: string): boolean => {
  return window.location.hash.replace('#', '') !== hashStr;
};
const CheckedRouteHash = (hashStr: string): boolean => {
  return window.location.hash.replace('#', '') === hashStr;
};
const goRoute = (hashStr: string): void => {
  if(!hashStr) {
    throw new Error('wrong param hashStr');
  }
  const loc = window.location;
  const urlHash = loc.hash;
  const url = loc.href;
  if(urlHash.includes('#start')) {
    loc.href = url.replace('#start', `#${hashStr}`);
  } else if(urlHash.includes('#') || !urlHash) {
    loc.href = url.replace('#', `#${hashStr}`);
  }
};
const getScoped = (): any => {
  let scoped;
  if(CheckedRouteResultHash()) {
    scoped = Game;
  } else {
    scoped = GameResult;
  }
  return scoped;
};
export {
  CheckedRouteResultHash,
  CheckedOtherThanRouteHash,
  CheckedRouteHash,
  goRoute,
  getScoped
};