import './App.css';
import Header from './components/Header'
import Game from './components/Game'
import model from './classes/GameModel'
import { StoreProvider, createStore } from 'easy-peasy'
import { useState } from 'react'


const store = createStore(model)

function App() {

  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <StoreProvider store={store}>
      <div className={darkMode ? "dark" : ""}>
        <div className="transition-colors ease-in-out min-h-screen bg-gray-100 dark:bg-gray-800">
          <div className="mx-auto lg:max-w-screen-lg p-4">
            <div className="flex flex-col justify-center p-6 text-center space-y-8 items-start">
              <Header title={'Glypoon'} onToggle={toggleDarkMode} />
              <Game />
            </div>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;