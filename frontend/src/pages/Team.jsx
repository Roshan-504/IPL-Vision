import React from 'react'

function Team() {
  return (
    <div className=' bg-slate-200 p-6 '>
        <SearchBar label="" placeholder="JJ Bumrah" onSelect={setSelectedBowler} width="30vw" api="get-total-bowler" />
        
    </div>
  )
}

export default Team