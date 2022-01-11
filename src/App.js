import './App.css';
import Header from './components/Header'
import DarkModeToggle from './components/DarkModeToggle'
import Game from './components/Game'
import model from './classes/GameModel'
import { StoreProvider, createStore } from 'easy-peasy'
import { useState, useEffect } from 'react'


const store = createStore(model)

function App() {
  const getSystemDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches
  const [darkMode, setDarkMode] = useState(getSystemDarkTheme())

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addEventListener('change', (e) => setDarkMode(e.matches))
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <StoreProvider store={store}>
      <div className={darkMode ? "dark" : ""}>
        <div className="transition-colors ease-in-out min-h-screen bg-gray-100 dark:bg-gray-800">
          <div className="mx-auto lg:max-w-screen-lg p-4">
            <div className="flex flex-col justify-center p-6 text-center space-y-8 items-start">
              <div className="flex flex-row w-full items-center justify-between">
                <Header title={'Glypoon'} />
                <DarkModeToggle onToggle={toggleDarkMode} isDarkMode={darkMode} />
              </div>
              <Game />
            </div>
          </div>
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;