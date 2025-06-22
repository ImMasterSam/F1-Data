import './App.css'
import ConstructorStanding from './Component/ConstructorStanding'
import DriverStanding from './Component/DriverStanding'

function App() {

  return (
    <>
      <h1>F1 Dashboard</h1>
      <div className='standing-table'>
        <ConstructorStanding />
        <DriverStanding />      
      </div>

    </>
  )
}

export default App
