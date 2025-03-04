import React from 'react'
import Sidebar from '../components/Sidebar'
import Batter from './Batter'

function Home() {
  return (
    <div>

        <div className="flex">
            <Sidebar/>
            <div className='w-4/5 h-[calc(100vh-4rem)] overflow-y-scroll scrollbar-hidden'>
                <Batter/>
            </div>
        </div>

    </div>
  )
}

export default Home