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
function fetchGameList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGameList);
    }, 100)
  })
}
test('fetch game list Test', () => {
  fetchGameList().then(list => {
    expect(list).toEqual(mockGameList);
  });
});

test("game set Test", () => {
  Game.gameList = mockGameList;
  Game.setGame(5);
  expect(Game.gameIdx).toEqual(5);
  expect(Game.isStart).toBeTruthy();
});

