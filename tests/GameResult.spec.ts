import GameResult from "../src/layouts/GameResult";
import Game from "../src/layouts/Game";
const mockGameList = [
  {
    text: 'hello',
    time: 10
  },
  {
    text: 'developers',
    time: 15
  },
  {
    text: 'kakaopay',
    time: 12
  },
  {
    text: 'join',
    time: 5
  },
  {
    text: 'is',
    time: 2
  },
  {
    text: 'world',
    time: 10
  }
];
test("game end Test", () => {
  Game.gameList = mockGameList;
  Game.gameIdx = 5;
  Game.score = 10;
  Game.isStart = true;
  GameResult.handleClickAnchor();
  expect(Game.gameIdx).toEqual(0);
  expect(Game.isStart).toBeFalsy();
  expect(Game.score).toEqual(mockGameList.length);
});

