import './App.css';
import Header from './components/Header'
import Game from './components/Game'
import model from './classes/GameModel'
import { StoreProvider, createStore } from 'easy-peasy'

const store = createStore(model)

function App() {
  return (
    <StoreProvider store={store}>
      <div className="min-h-screen bg-gray-100 text-coolGray-800">
        <div className="mx-auto lg:max-w-screen-lg p-4">
          <div className="flex flex-col justify-center p-6 text-center space-y-8 items-start">
            <Header title={'Glypoon'} />
            <Game />
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;