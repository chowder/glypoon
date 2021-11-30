import './App.css';
import Header from './components/Header'
import ChristmasModeToggle from './components/ChristmasModeToggle'
import DarkModeToggle from './components/DarkModeToggle'
import Game from './components/Game'
import model from './classes/GameModel'
import { StoreProvider, createStore } from 'easy-peasy'
import { useState, useEffect } from 'react'
import Snowfall from 'react-snowfall'


const store = createStore(model)

function App() {
  const getSystemDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches
  const [darkMode, setDarkMode] = useState(getSystemDarkTheme())
  const [christmasMode, setChristmasMode] = useState(false)

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addEventListener('change', (e) => setDarkMode(e.matches))
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleChristmasMode = () => {
    setChristmasMode(!christmasMode)
  }

  return (
    <StoreProvider store={store}>
      <div className={darkMode ? "dark" : ""}>
        <div className="transition-colors ease-in-out min-h-screen bg-gray-100 dark:bg-gray-800">
          <div className="mx-auto lg:max-w-screen-lg p-4">
            <div className="flex flex-col justify-center p-6 text-center space-y-8 items-start">
              <div className="flex md:flex-row flex-col w-full items-center justify-between">
                <Header title={christmasMode ? 'Glypoon ‍🎄' : 'Glypoon'} />
                <div className="flex space-x-8 mt-8 lg:mt-0">
                  <ChristmasModeToggle onToggle={toggleChristmasMode} isChristmasMode={christmasMode}/>
                  <DarkModeToggle onToggle={toggleDarkMode} isDarkMode={darkMode} />
                </div>
              </div>
              <Game />
            </div>
          </div>
        </div>
      </div>
      {christmasMode && <Snowfall snowflakeCount={100}/>}
    </StoreProvider>
  );
}

export default App;