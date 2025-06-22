import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import StandingPage from './Page/StandingPage'
import HomePage from './Page/HomePage'
import SchedulePage from './Page/SchedulePage'

function App() {

  return (
    <>
      <BrowserRouter basename='/F1-Data'>
        <h1>F1 Data Analysis</h1>
        <div className='main-container'>
          <nav className='side-bar'>
            <Link to="/">Home</Link>
            <Link to="/standings">Standings</Link>
            <Link to="/schedule">Schedule</Link>
          </nav>
          
          <Routes>
            <Route index element={<HomePage />}/>
            <Route path='standings' element={<StandingPage />} />
            <Route path='schedule' element={<SchedulePage />} />
          </Routes>
              
        </div>
      </BrowserRouter>  
    </>
  )
}

export default App
