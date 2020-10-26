import Game from "../layouts/Game";
import GameResult from "../layouts/GameResult";
import {IRoute} from "../interfaces";
import {CheckedRouteResultHash, getScoped} from "../helpers";

const routes: IRoute = {
  '/': Game.start,
  '/start': Game.start,
  '/result': GameResult.start
};
function callRoute(): void {
  const route = getHashRoute();
  const scoped = getScoped();
  route.call(scoped);
}
function initialRoutes(): void {
  callRoute();

  hashCange();
}
function hashCange() {
  window.addEventListener('hashchange', () => {
    callRoute();
  });
}
function getHashRoute(): () => void {
  let route: () => void;

  Object.keys(routes).forEach(hashRoute => {
    if (window.location.hash.replace('#', '') === hashRoute.replace('/', '')) {
      route = routes[hashRoute];
    }
  });
  return route;
}

export {
  initialRoutes
};