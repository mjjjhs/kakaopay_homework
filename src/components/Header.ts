import {EGame} from "../enums/Texts";
import {EConfig, ERoute} from "../enums/Config";
import Game from "../layouts/Game";
import {CheckedRouteHash, goRoute} from "../helpers";

const doc = document;
const proxyTarget = {};

const proxyHandler: ProxyHandler<any> = {
  get: (target: any, name: any): any => target[name],
  set: (obj, prop, value): boolean => {
    switch(prop) {
      case 'word':
        doc.getElementById('word').textContent = value;
        break;
      case 'score':
        doc.getElementById('score').textContent = value;
        break;
      case 'second':
        if(value < 0) {
          clearInterval(Header.interval);
          --Game.score;
          proxy['score'] = Game.score;
          Game.leadTimeByGame.delete(Game.gameIdx.toString());
          // if(Game.gameIdx < 3) {
          if(Game.gameIdx < Game.gameList.length - 1) { //주석제거
            Game.setGame(Game.gameIdx + 1);
          } else {
            Game.setStorage();
            Game.proxy['isStart'] = false;
            goRoute(ERoute.RESULT);
          }
          return true;
        }
        const node = doc.getElementById('remain_second');
        if(!node) {
          clearInterval(Header.interval);
          return true;
        }
        node.textContent = value;
        break;
      case 'props':
        Header.second = value.curGame.second;
        proxy['second'] = Header.second;
        proxy['score'] = value.score;
        proxy['word'] = value.curGame.text;
        break;
      default:
    }
    obj[prop] = value;
    return true;
  }
};

const proxy: ProxyConstructor = new Proxy(proxyTarget, proxyHandler);

const Header: any = {
  interval:<ReturnType<typeof setInterval>> null,
  second:<number> 0,
  setInterval: function(): void {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      --this.second;
      proxy['second'] = this.second;
    }, EConfig.REMAIN_SEC_INTERVAL_TIME);
  },
  start: function(props): void {
    this.render.call(this);
    this.setGame(props);
  },
  setGame: function(props) {
    proxy['props'] = props;
    if(CheckedRouteHash(ERoute.START)) {
      Game.leadTimeByGame.set(Game.gameIdx.toString(), {startTime: new Date().getTime()});
      this.setInterval();
    } else {
      this.interval && clearInterval(this.interval);
    }
  },
  render: function(): void {
    const template = `
      <h1 class="screen_out">${EGame.TYPING_GAME}</h1>
      <ul class="list_info">
        <li>
          ${EGame.REMAIN_TIME} : 
          <span id="remain_second"></span>
          ${EGame.SECOND}
        </li>
        <li>${EGame.SCORE} : 
          <span id="score"></span>
          ${EGame.POINT}
        </li>
      </ul>
      <h2 id="word" class="tit_question"></h2>
    `;
    const target = doc.getElementById('header');
    target.innerHTML = template;
  }
};

export default Header;