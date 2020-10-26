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
  window.location.href = `${window.location.origin}/#${hashStr}`;
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