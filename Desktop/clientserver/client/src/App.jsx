import { useState } from 'react'
import LongPulling from "./LongPulling.jsx";
import EventSourcing from "./EventSourcing";
import WebSocketTest from "./WebSocketTest.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
      <div className='flex items-center justify-center w-[100vw] h-[100vh]'>

          <WebSocketTest/>
      </div>
  )
}

export default App
