import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Canvas from './components/Canvas';
import Settingbar from './components/Settingbar';
import Toolbar from './components/Toolbar';
import './styles/app.scss';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path='/:id' element={<><Toolbar /> <Settingbar /> <Canvas /></>} />
          <Route path='/' element={<><Toolbar /> <Settingbar /> <Canvas /><Navigate to={`/f${(+new Date()).toString(16)}`} replace/></>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
