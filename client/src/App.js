import Canvas from './components/Canvas';
import Settingbar from './components/Settingbar';
import Toolbar from './components/Toolbar';
import './styles/app.scss';

function App() {
  return (
    <div className="App">
      <Toolbar/>
      <Settingbar/>
      <Canvas/>
    </div>
  );
}

export default App;
