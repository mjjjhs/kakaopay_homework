import Header from "../components/Header";
import {EGame} from "../enums/Texts";
import {
  CheckedOtherThanRouteHash,
  CheckedRouteResultHash,
  Fetch,
  goRoute,
  HandleError, Util
} from "../helpers";
import {IGame, IGameProxyTarget, ILeadTimeByGame} from "../interfaces";
import {ERoute} from "../enums/Config";

const doc = document;
const proxyTarget:IGameProxyTarget = {};
const proxyHandler:ProxyHandler<any> = {
  get: (target: any, name: any): any => target[name],
  set: (obj, prop, value): boolean => {
    switch (prop) {
      case 'gameIdx': {
        if(!Game.gameList?.length) {
          HandleError({message: '게임 데이터가 없습니다.'});
          return true;
        }
        if(value < 0) {
          HandleError({message: 'Wrong Game Index!'});
          return true;
        }
        if(Game.gameIdx !== value) {
          Game.gameIdx = value;
        }
        if(!Game.gameList[value]) {
          HandleError({message: '게임 데이터가 없습니다.'});
          return true;
        }

        Game.curGame = Game.gameList[value];

        if(!CheckedRouteResultHash()) {
          return true;
        }
        Header.start({curGame: Game.curGame, score: Game.score});
        break;
      }
      case 'isStart': {
        if(Game.isStart === value) {
          return true;
        }
        Game.isStart = value;
        if(!CheckedRouteResultHash()) {
          return true;
        }
        const wordInputNode = doc.getElementById('word_input') as HTMLInputElement;
        wordInputNode.disabled = !value;
        value && wordInputNode.focus();

        const anchorNode = doc.getElementById('game_btn') as HTMLAnchorElement;
        Game.triggerAnchor(anchorNode, value);
        break;
      }
      default:
    }
    obj[prop] = value;
    return true;
  }
};

const Game: any = {
  proxy:<ProxyConstructor> new Proxy(proxyTarget, proxyHandler),
  gameList:<IGame[]> [],
  curGame:<IGame> null,
  gameIdx:<number> null,
  score:<number> 0,
  leadTimeByGame: new Map<string, ILeadTimeByGame>([]),
  isStart:<boolean> false,
  start: async function(): Promise<void> {
    if(!this.gameList?.length) {
      this.gameList = await Fetch('https://my-json-server.typicode.com/kakaopay-fe/resources/words');
      this.score = this.gameList?.length || 0;
    }
    if(this.leadTimeByGame.size) {
      this.leadTimeByGame.clear();
    }
    this.render();
    this.initScore();
    this.initGame();
    if(!CheckedOtherThanRouteHash(ERoute.START)){
      this.setGame(this.gameIdx);
    }
    this.setEvent();
  },
  triggerAnchor: (anchorNode: HTMLAnchorElement, value: boolean): void => {
    if(!value) {
      anchorNode.textContent = EGame.START;
      Util.replaceClass(anchorNode, 'btn_init', 'btn_start');
      anchorNode.setAttribute('href', '#start');
    } else {
      anchorNode.textContent = EGame.INIT;
      Util.replaceClass(anchorNode, 'btn_start', 'btn_init');
      anchorNode.setAttribute('href', '#');
    }
  },
  handleKeyDownWordInput: function(e: KeyboardEvent): void {
    const {code, target} = e;
    switch(code) {
      case 'Enter':
        this.compareAnswer.call(this, target);
        break;
      default:
    }
  },
  compareAnswer: function(inputNode: EventTarget): void {
    const word = (<HTMLInputElement>inputNode).value;
    (<HTMLInputElement>inputNode).value = '';
    if(this.curGame.text === word) {
      this.leadTimeByGame.set(
        this.gameIdx.toString(),
        {
          ...this.leadTimeByGame.get(this.gameIdx.toString()),
          endTime: new Date().getTime()
        }
      );
      if(this.gameIdx < this.gameList.length - 1) { //주석제거
        this.setGame(this.gameIdx + 1);
      } else {
        Game.proxy['isStart'] = false;
        Game.setStorage();
        Game.leadTimeByGame.clear();
        goRoute(ERoute.RESULT);
      }
    }
  },
  setStorage: function() {
    const leadTimeArr: ILeadTimeByGame[] = [];
    this.leadTimeByGame.forEach((value) => {
      leadTimeArr.push(value);
    });
    if(sessionStorage.getItem('gameResult')) {
      sessionStorage.removeItem('gameResult');
    }
    sessionStorage.setItem('gameResult', JSON.stringify(leadTimeArr));
  },
  setEvent: function(): void {
    const inputNode = doc.getElementById('word_input') as HTMLInputElement;
    if(!inputNode.getAttribute('isUseClickEvent')) {
      inputNode.setAttribute('isUseClickEvent', 'true');
      const handleKeyDownWordInput = this.handleKeyDownWordInput.bind(Game);
      inputNode.addEventListener('keydown', handleKeyDownWordInput);
      inputNode.addEventListener('blur', function() {
        this.focus();
      });
    }
  },
  initGame: function(): void {
    if(this.isStart) {
      this.proxy['isStart'] = false;
    }
    this.proxy['gameIdx'] = 0;
  },
  initScore: function(): void {
    this.score = this.gameList?.length || 0;
  },
  setGame: function(gameIdx: number): void {
    this.proxy['gameIdx'] = typeof gameIdx !== 'number' ? 0 : gameIdx;
    if(!this.isStart) {
      this.proxy['isStart'] = true;
    }
  },
  render: function(): void {
    const fragment = new DocumentFragment();
    let contentEl = doc.createElement('div');
    contentEl.setAttribute('id', 'game_content');

    const headerEl = doc.createElement('div');
    headerEl.setAttribute('id', 'header');
    Util.addClass(headerEl, 'header');

    const sectionEl = doc.createElement('section');
    Util.addClass(sectionEl, 'section_game');

    const inputEl = doc.createElement('input');
    inputEl.setAttribute('type', 'text');
    inputEl.setAttribute('id', 'word_input');
    inputEl.setAttribute('placeholder', EGame.INPUT);
    Util.addClass(inputEl, 'inp_txt');
    inputEl.disabled = true;

    const anchorEl = doc.createElement('a');
    anchorEl.setAttribute('id', 'game_btn');
    anchorEl.setAttribute('href', '#start');
    Util.addClass(anchorEl, 'btn_comm btn_start');
    const textNode = doc.createTextNode(EGame.START);
    anchorEl.appendChild(textNode);

    sectionEl.appendChild(inputEl);
    sectionEl.appendChild(anchorEl);

    contentEl.appendChild(headerEl);
    contentEl.appendChild(sectionEl);

    fragment.appendChild(contentEl);

    const target = doc.getElementById('container');
    target.innerHTML = fragment.getElementById('game_content').innerHTML;
  }
};

export default Game;