import React from 'react'
import SearchBar from '../components/SearchBar'
import useBatterStore from "../store/batterStore.js";

function Batter() {

    const {selectedBatter , setSelectedBatter} = useBatterStore();
    console.log(selectedBatter)

  return (
    <div className='w-4/5 bg-slate-200 p-6 '>
        <SearchBar label="Search Batters " placeholder="Search Batter" onSelect={setSelectedBatter} width="30vw" api="get-total-players" />
    </div>
  )
}

export default Batter