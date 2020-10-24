import React, { useState } from 'react';
import Chat from './components/Chat'
import './App.css';
import Input from './components/Input';

const App = () => {

  const [value, setValue] = useState("")
  const [userName, setUserName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setUserName(value)
  }

  return (
    <div className="App">
      {!userName ?
        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            placeholder="Your Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button disabled={!value}>Submit</button>
        </form>
      : (
        <>
          <Chat user={userName}/>
          <Input user={userName} />
        </>
      )
      }
    </div>
  );
}

export default App;
