import logo from './logo.svg';
import './App.css';

import { createContext, useCallback, useContext } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

const WS_URL = 'ws://localhost:3080';

// broadcasted to all descendants: ROOM, USERNAME, WebSocket

const usernameContext = createContext({}) // primitive type
const roomcodeContext = createContext({})
const WSContext = createContext({}) // not primitive

function RulesSec() { 

}

function SetusernameSec() { 

}

function NavigationBar() { 

}

function GameplayPage() { 
  
}

function UsernamePage() { 
  const {username, setUsername} = useContext(usernameContext)
  const {formcontent, setFormcontent} = useState('')

  const _setUsername = useCallback((e) => { 
    setUsername('good'); 
    e.preventDefault(); 
  })

  return (
    <div>
      <form onSubmit={_setUsername}>
        <input onChange={(e) => { setFormcontent(e.target.value)}} type="text" placeholder='Enter your name'/>
        <button type="submit">Let's go!</button>
      </form>
    </div>
  )
}

function LandingPage() { 
  const {roomcode, setRoomcode} = useContext(roomcodeContext)
  const {formcontent, setFormcontent} = useState('')

  const createRoom = useCallback(() => {
    setRoomcode('1'); 
  })

  const enterRoom = useCallback((e) => { 
    setRoomcode(roomcode); 
    e.preventDefault(); 
  })

  return (
    <div>
      <button onClick={createRoom}>Create a new room</button>
      <form onSubmit={enterRoom}>
        <input onChange={(e) => { setFormcontent(e.target.value)}} type="text" placeholder='Enter a room code'/>
        <button type="submit">Enter an existing room</button>
      </form>
    </div>
  )
}

function Page() { 

}

function App() { 
  const [username, setUsername] = useState('')
  const [roomcode, setRoomcode] = useState('')
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  }); // this connection is closed when the object is destructed? 

  return ( // wrapping a state hook inside a context just to update? seems really stupid
      <usernameContext.Provider value = {{username, setUsername}} >
        <roomcodeContext.Provider value = {{roomcode, setRoomcode}} >
          <WSContext.Provider value = {{sendMessage, lastMessage, readyState}}>
            {roomcode == '' && <LandingPage/>} 
            {/* JSX code must be wrapped inside {} */}
            {roomcode != '' && username == '' && <UsernamePage/>}
            {roomcode != '' && username != '' && <GameplayPage/>}
          </WSContext.Provider>
        </roomcodeContext.Provider>
      </usernameContext.Provider>
  );
}

export default App;
