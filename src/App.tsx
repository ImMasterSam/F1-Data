import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import StandingPage from './Page/StandingPage'
import HomePage from './Page/HomePage'
import SchedulePage from './Page/SchedulePage'

function App() {

  return (
    <>
      <h1>F1 Data Analysis</h1>
      <div className='main-container'>
        <nav className='side-bar'>
          <a href="/">Home</a>
          <a href="/standings">Standings</a>
          <a href="/schedule">Schedule</a>
        </nav>
        <BrowserRouter>
          <Routes>
            <Route index element={<HomePage />}/>
            <Route path='standings' element={<StandingPage />} />
            <Route path='schedule' element={<SchedulePage />} />
          </Routes>
        </BrowserRouter>       
      </div>
    </>
  )
}

export default App
