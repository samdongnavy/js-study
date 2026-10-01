import { useState } from 'react'

function Counter({ count, onIncrement }) {
  return (
    <div>
      <h2>Counter: {count}</h2>

      <button onClick={onIncrement}>
        증가
      </button>
    </div>
  )
}

function App() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)

  return (
    <div>
      <h1>총합: {count1 + count2}</h1>

      <Counter
        count={count1}
        onIncrement={() => setCount1(count1 + 1)}
      />

      <Counter
        count={count2}
        onIncrement={() => setCount2(count2 + 1)}
      />
    </div>
  )
}

export default App