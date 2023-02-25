import logo from './logo.svg';
import './App.css';

import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

const WS_URL = 'ws://localhost:3080';

// broadcasted to all descendants: ROOM, USERNAME, WebSocket

const usernameContext = createContext({}) // primitive type
const roomcodeContext = createContext({})
const WSContext = createContext({}) // not primitive

function RulesSec() { 

}

function Avatar(props) { 

}

function HealthBar(props) { 
}

function NumberCard(props) { 
   
}

function SpellCard(props) { 
}


function Deck(props) { 
  return 
    <div className='Deck'>
      Trumpcards
    </div>
}

function Player(props) { 
  return (
    <div className='Player'>
      {props}
    </div>
  )
}

function GameplayPage() { 
  const {lastJsonMessage, sendJsonMessage, readyState} = useContext(WSContext)
  const [gamestate, setGamestate] = useState({
    player: [
      {
        username : 'you', 
        avatar : 0, 
        onTable : [1, 2], 
        spellTable : ["Draw 7"], 
        spellCards : ["Draw 7"], 
        health : 30, 
        attack : 50, 
      }, 
      {
        username : 'op', 
        avatar : 1, 
        onTable : [-1, 3], 
        spellTable : ["Draw 6"], 
        spellCards : [-1], 
        health : 60, 
        attack : 20, 
      }
    ], 
    turn : 1, 
    winner: -1, 
    you: 0, 
    round: 1, 
    targetScore: 14, 
  })

  let youId = 0, opId = 1; 

  useEffect(() => {
    setGamestate({
      ...lastJsonMessage.data
    })
    youId = gamestate.you; 
    opId = 1 - youId; 
  }, [lastJsonMessage])
  
  return (
    <div className='GameplayPage Page'>
      <Deck/>
      <Player {...gamestate.player[youId]} isWinner = {youId === gamestate.winner} thisTurn = {youId === gamestate.turn} isYou = {true}/>
      <Player {...gamestate.player[opId]} isWinner = {opId === gamestate.winner} thisTurn = {opId === gamestate.turn} isYou = {false}/>
    </div>
  )
}

function UsernamePage() { 
  const {username, setUsername} = useContext(usernameContext)
  const [formcontent, setFormcontent] = useState('')

  const _setUsername = useCallback((e) => { 
    setUsername('good'); 
    e.preventDefault(); 
  })

  return (
    <div className='UsernamePage Page'>
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
    <div className='LandingPage Page'>
      <button onClick={createRoom}>Create a new room</button>
      <form onSubmit={enterRoom}>
        <input onChange={(e) => { setFormcontent(e.target.value)}} type="text" placeholder='Enter a room code'/>
        <button type="submit">Enter an existing room</button>
      </form>
    </div>
  )
}

function App() { 
  const [username, setUsername] = useState('')
  const [roomcode, setRoomcode] = useState('')
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }
  }); // this connection is closed when the object is destructed? 

  return ( // wrapping a state hook inside a context just to update? seems really stupid
      <usernameContext.Provider value = {{username, setUsername}} >
        <roomcodeContext.Provider value = {{roomcode, setRoomcode}} >
          <WSContext.Provider value = {{sendJsonMessage, lastJsonMessage, readyState}}>
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
