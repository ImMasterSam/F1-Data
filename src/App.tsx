import { BrowserRouter, Route, Routes } from 'react-router-dom'
import HomePage from './Page/HomePage'
import SchedulePage from './Page/SchedulePage'
import LiveTimingPage from './Page/LiveTimingPage'
import SideNav from './Component/SideNav/SideNav'
import DriversPage from './Page/StandingPage/DriversPage'
import ConstructorsPage from './Page/StandingPage/ConstructorsPage'
import './CSS/App.css'
import { FaGithub } from 'react-icons/fa'

function App() {

  return (
    <>
      <BrowserRouter basename='/F1-Data'>
        <SideNav />
        <div className='main-container'>

            <div className='main-title'>
              <h1>F1 Data Analysis</h1>
              <a href='https://github.com/ImMasterSam/F1-Data' target="_blank" rel="noopener noreferrer">
                <FaGithub />
              </a>
            </div>

            <Routes>
              <Route index element={<HomePage />}/>
              <Route path='livetiming' element={<LiveTimingPage />} />
              <Route path='standings/drivers' element={<DriversPage />} />
              <Route path='standings/constructors' element={<ConstructorsPage />} />
              <Route path='schedule' element={<SchedulePage />} />
            </Routes>        
        </div>
      </BrowserRouter>  
    </>
  )
}

export default App
