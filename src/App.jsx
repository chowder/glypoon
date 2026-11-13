import './App.css';
import Header from './components/Header'
import ChristmasModeToggle from './components/ChristmasModeToggle'
import DarkModeToggle from './components/DarkModeToggle'
import Game from './components/Game'
import model from './classes/GameModel'
import { StoreProvider, createStore } from 'easy-peasy'
import { useState, useEffect } from 'react'
import Snowfall from 'react-snowfall'
import useMediaQuery from './hooks/useMediaQuery'


const store = createStore(model)

function App() {
  const getSystemDarkTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches
  const [darkMode, setDarkMode] = useState(getSystemDarkTheme())
  const [christmasMode, setChristmasMode] = useState(false)
  const compact = useMediaQuery("(max-width: 767px), not all and (any-pointer: fine)")

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addEventListener('change', (e) => setDarkMode(e.matches))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleChristmasMode = () => {
    setChristmasMode(!christmasMode)
  }

  const title = christmasMode ? 'Glypoon ‍🎄' : 'Glypoon'

  const settings = (
    <>
      <div className="flex flex-row items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-gray-50">Christmas</span>
        <ChristmasModeToggle onToggle={toggleChristmasMode} isChristmasMode={christmasMode}/>
      </div>
      <div className="flex flex-row items-center justify-between">
        <span className="font-medium text-gray-900 dark:text-gray-50">Dark mode</span>
        <DarkModeToggle onToggle={toggleDarkMode} isDarkMode={darkMode} />
      </div>
    </>
  )

  return (
    <StoreProvider store={store}>
      <div>
        <div className="transition-colors ease-in-out min-h-[100dvh] bg-gray-100 dark:bg-gray-800">
          {compact ?
            <Game compact title={title} settings={settings} /> :
            <div className="mx-auto lg:max-w-screen-lg p-4">
              <div className="flex flex-col justify-center p-6 text-center space-y-8 items-start">
                <div className="flex flex-row w-full items-center justify-between">
                  <Header title={title} />
                  <div className="flex space-x-8">
                    <ChristmasModeToggle onToggle={toggleChristmasMode} isChristmasMode={christmasMode}/>
                    <DarkModeToggle onToggle={toggleDarkMode} isDarkMode={darkMode} />
                  </div>
                </div>
                <Game />
              </div>
            </div>}
          {christmasMode && <Snowfall snowflakeCount={100}/>}
        </div>
      </div>
    </StoreProvider>
  );
}

export default App;