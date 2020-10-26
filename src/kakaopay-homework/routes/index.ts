import Game from "../layouts/Game";
import GameResult from "../layouts/GameResult";
import {IRoute} from "../interfaces";
import {CheckedRouteResultHash, getScoped} from "../helpers";
import {ERoute} from "../enums/Config";

const routes: IRoute = {
  '/': Game.start,
  '/start': Game.start,
  '/result': GameResult.start
};

function initialRoutes(): void {
  if(!CheckedRouteResultHash() && !sessionStorage.getItem('gameResult')) {
    alert('게임 결과가 없습니다.');
    window.location.href = `${window.location.origin}/#`;
    return;
  }
  const route = getHashRoute();
  const scoped = getScoped();
  route.call(scoped);

  hashCange();
}
function hashCange() {
  window.addEventListener('hashchange', () => {
    const route = getHashRoute();
    const scoped = getScoped();
    route.call(scoped);
  })
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
}