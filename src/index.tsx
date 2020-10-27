import './styles/Reset.scss';
import './styles/App.scss';
import {initialRoutes} from "./routes";

const doc = document;

const App: any = {
  start: function(): void {
    this.render();
  },
  render: function(): void {
    const template = '<main id="container"></main>';

    const rootNode = doc.getElementById('root');
    rootNode.innerHTML = template;
  }
};

export default App;

window.onload = (): void => {
  App.start();
  initialRoutes();
};

