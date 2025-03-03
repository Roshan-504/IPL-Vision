import React from 'react'
import Sidebar from '../components/Sidebar'
import Batter from './Batter'

function Home() {
  return (
    <div>

        <div className="flex">
            <Sidebar/>
            <Batter/>
        </div>

    </div>
  )
}

export default Home