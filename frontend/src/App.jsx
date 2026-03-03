import { useState , useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('Loading...');

  useEffect(() =>{
    setTimeout(() => {
      setMessage('data loaded...');
    }, 1000);},
  []);

  return (
    <div className="App">
      <h1>Dmp</h1>
      <p>Welcome</p>
      <p>Count : {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <p>{message}</p>
    </div>

  );
}

export default App
