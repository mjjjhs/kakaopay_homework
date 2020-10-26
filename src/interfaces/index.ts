export interface IRoute {
  '/': () => void,
  '/start': () => void,
  '/result': () => void
}
export interface IGame {
  text?: string;
  second?: number;
}
export interface IGameProxyTarget {
  gameIdx?: number;
  curGame?: IGame;
  score?: number;
}
export interface ILeadTimeByGame {
  gameIdx?: number;
  startTime?: number;
  endTime?: number;
}