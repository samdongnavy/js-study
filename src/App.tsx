import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const add = () => {
    setCount(prev => prev + 1)
  }

  return (
    <div>
      <h1>카운터</h1>
      <h2>{count}</h2>
      <button onClick={add}>증가</button>
    </div>
  )
}

export default App