import {EGame} from "../enums/Texts";
import Game from "./Game";
import {ILeadTimeByGame} from "../interfaces";
import {CheckedRouteResultHash} from "../helpers";

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
    this.averageSec = this.gameResult ? Math.floor(this.gameResult?.map((item: ILeadTimeByGame) => (item.endTime - item.startTime) / 1000)
      .reduce((cur, prev) => cur + prev) / this.gameResult.length) : 0;

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
    const template = `
      <section class="section_result">
        <h3>Mission Complete!</h3>
        <div class="tit_result">당신의 점수는 ${this.gameResult?.length || 0}점입니다.</div>
        <div class="txt_notice">단어당 평균 답변 시간은 ${this.averageSec || 0}초입니다.</div>
        <a 
          id="btn_restart"
          class="btn_comm btn_restart" 
          href="#start"
        >
          ${EGame.RESTART}
        </a>
      </section>
    `;
    const containerNode = doc.getElementById('container');
    containerNode.innerHTML = template;
  }
};

export default GameResult;