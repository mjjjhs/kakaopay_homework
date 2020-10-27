import {EGame} from "../enums/Texts";
import Game from "./Game";
import {ILeadTimeByGame} from "../interfaces";
import {Util} from "../helpers";

const doc = document;

const GameResult: any = {
  gameResult: <ILeadTimeByGame[]> [],
  averageSec: <number> 0,
  start: function(): void {
    this.gameResult = JSON.parse(sessionStorage.getItem('gameResult'));
    if(!this.gameResult) {
      alert('게임 결과가 없습니다.');
      window.location.href = window.location.href.replace('#result', '#');
      return;
    }
    this.averageSec = this.gameResult && this.gameResult.length
      ?
      Math.floor(this.gameResult.map((item: ILeadTimeByGame) => (item.endTime - item.startTime) / 1000)
        .reduce((cur, prev) => cur + prev, 0) / this.gameResult.length)
        : 0;

    if(this.isStart) {
      this.proxy['isStart'] = false;
    }
    this.render();
    this.setEvent();
  },
  handleClickAnchor: (): void => {
    Game.initGame();
    Game.initScore();
  },
  setEvent: function(): void {
    const anchorNode = doc.getElementById('btn_restart') as HTMLAnchorElement;
    if(!anchorNode.getAttribute('isUseClickEvent')) {
      anchorNode.setAttribute('isUseClickEvent', 'true');
      const handleClickAnchor = this.handleClickAnchor.bind(GameResult);
      anchorNode.addEventListener('click', handleClickAnchor);
    }
  },
  render: function(): void {
    const fragment = new DocumentFragment();
    const contentEl = doc.createElement('div');
    contentEl.setAttribute('id', 'game_result_content');

    const sectionEl = doc.createElement('section');
    Util.addClass(sectionEl, 'section_result');

    const h3El = doc.createElement('h3');
    let textNode = doc.createTextNode('Mission Complete!');
    h3El.appendChild(textNode);
    sectionEl.appendChild(h3El);

    let divEl = doc.createElement('div');
    Util.addClass(divEl, 'tit_result');
    textNode = doc.createTextNode(`당신의 점수는 ${this.gameResult?.length || 0}점입니다.`);
    divEl.appendChild(textNode);
    sectionEl.appendChild(divEl);

    divEl = doc.createElement('div');
    Util.addClass(divEl, 'txt_notice');
    textNode = doc.createTextNode(`단어당 평균 답변 시간은 ${this.averageSec || 0}초입니다.`);
    divEl.appendChild(textNode);
    sectionEl.appendChild(divEl);

    const anchorEl = doc.createElement('a');
    Util.addClass(anchorEl, 'btn_comm btn_restart');
    anchorEl.setAttribute('href', '#start');
    anchorEl.setAttribute('id', 'btn_restart');
    textNode = doc.createTextNode(EGame.RESTART);
    anchorEl.appendChild(textNode);
    sectionEl.appendChild(anchorEl);

    contentEl.appendChild(sectionEl);
    fragment.appendChild(contentEl);

    const target = doc.getElementById('container');
    target.innerHTML = fragment.getElementById('game_result_content').innerHTML;
  }
};

export default GameResult;