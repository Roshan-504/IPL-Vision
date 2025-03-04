import React from 'react'
import Sidebar from '../components/Sidebar'
import Batter from './Batter'

function Home() {
  return (
    <div>

        <div className="flex overflow-x-auto">
            <Sidebar/>
            <Batter/>
        </div>

    </div>
  )
}

export default Home