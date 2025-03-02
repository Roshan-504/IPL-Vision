import React, { useEffect } from 'react'
import { useState } from 'react'

function App() {

  const [data,setData] = useState("")

  useEffect(() => {
    fetch("http://127.0.0.1:5000/")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Convert response to JSON
      })
      .then(data => setData(data)) // Store JSON data in state
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold underline">
    {data ? JSON.stringify(data, null, 2) : "Loading..."}
  </h1>
    </>
  )
}

export default App