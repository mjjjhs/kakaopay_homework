import {EGame} from "../enums/Texts";
import {EConfig, ERoute} from "../enums/Config";
import Game from "../layouts/Game";
import {CheckedRouteHash, goRoute, HandleError, Util} from "../helpers";
import {IHeaderList} from "../interfaces";

const doc = document;
const proxyTarget = {};

const proxyHandler: ProxyHandler<any> = {
  get: (target: any, name: any): any => target[name],
  set: (obj, prop, value): boolean => {
    switch(prop) {
      case 'word':
        const wordEl = doc.getElementById('word');
        if(wordEl) {
          wordEl.textContent = value;
        }
        break;
      case 'score':
        const scoreEl = doc.getElementById('score');
        if(scoreEl) {
          scoreEl.textContent = value;
        }
        break;
      case 'second':
        if(value < 0) {
          clearInterval(Header.interval);
          --Game.score;
          Header.proxy['score'] = Game.score;
          Game.leadTimeByGame.delete(Game.gameIdx.toString());
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
        Header.proxy['second'] = Header.second;
        Header.proxy['score'] = value.score;
        Header.proxy['word'] = value.curGame.text;
        break;
      default:
    }
    obj[prop] = value;
    return true;
  }
};



const Header: any = {
  proxy: <ProxyConstructor> new Proxy(proxyTarget, proxyHandler),
  interval: <ReturnType<typeof setInterval>> null,
  second:<number> 0,
  setInterval: function(): void {
    if(this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      --this.second;
      this.proxy['second'] = this.second;
    }, EConfig.REMAIN_SEC_INTERVAL_TIME);
  },
  start: function(props): void {
    this.render.call(this);
    this.setGame(props);
  },
  setGame: function(props) {
    this.proxy['props'] = props;
    if(CheckedRouteHash(ERoute.START)) {
      Game.leadTimeByGame.set(Game.gameIdx.toString(), {startTime: new Date().getTime()});
      this.setInterval();
    } else {
      this.interval && clearInterval(this.interval);
    }
  },
  render: function(): void {
    const fragment = new DocumentFragment();
    const contentEl = doc.createElement('div');
    contentEl.setAttribute('id', 'header_content');

    const h1El = doc.createElement('h1');
    Util.addClass(h1El, 'screen_out');
    let textNode = doc.createTextNode(EGame.TYPING_GAME);
    h1El.appendChild(textNode);

    const ulEl = doc.createElement('ul');
    Util.addClass(ulEl, 'list_info');

    const liArr: IHeaderList[] = [
      {
        title: `${EGame.REMAIN_TIME} : `,
        id: 'remain_second',
        text: EGame.SECOND
      },
      {
        title: `${EGame.SCORE} : `,
        id: 'score',
        text: EGame.POINT
      }
    ];
    liArr.map(li => {
      const liEl = doc.createElement('li');
      textNode = doc.createTextNode(li.title);
      liEl.appendChild(textNode);
      const spanEl = doc.createElement('span');
      spanEl.setAttribute('id', li.id);
      liEl.appendChild(spanEl);
      textNode = doc.createTextNode(li.text);
      liEl.appendChild(textNode);
      ulEl.appendChild(liEl);
    });

    const h2El = doc.createElement('h2');
    h2El.setAttribute('id', 'word');
    Util.addClass(h2El, 'tit_question');

    contentEl.appendChild(h1El);
    contentEl.appendChild(ulEl);
    contentEl.appendChild(h2El);

    fragment.appendChild(contentEl);

    const target = doc.getElementById('header');
    if(target) {
      target.innerHTML = fragment.getElementById('header_content').innerHTML;
    }
  }
};

export default Header;