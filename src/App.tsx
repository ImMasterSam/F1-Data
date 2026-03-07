import { BrowserRouter, Route, Routes } from 'react-router-dom'
import StandingPage from './Page/StandingPage'
import HomePage from './Page/HomePage'
import SchedulePage from './Page/SchedulePage'
import LiveTimingPage from './Page/LiveTimingPage'
import SideNav from './Component/SideNav/SideNav'
import './CSS/App.css'

function App() {

  return (
    <>
      <BrowserRouter basename='/F1-Data'>
        <SideNav />
        <div className='main-container'>

            <h1>F1 Data Analysis</h1>

            <Routes>
              <Route index element={<HomePage />}/>
              <Route path='livetiming' element={<LiveTimingPage />} />
              <Route path='standings' element={<StandingPage />} />
              <Route path='schedule' element={<SchedulePage />} />
            </Routes>        
        </div>
      </BrowserRouter>  
    </>
  )
}

export default App
