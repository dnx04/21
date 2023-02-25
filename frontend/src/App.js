import logo from './logo.svg';
import './App.css';

import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';


const { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } = require('./constants');
const { AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } = require('./constants');

const WS_URL = 'ws://localhost:3080';

// broadcasted to all descendants: ROOM, USERNAME, WebSocket

const usernameContext = createContext({}) // primitive type
const roomcodeContext = createContext({})

function Deck(props) { 
  return (
    <div id = "Deck"  className='card'>
      Cards left: {props.numLeft}
    </div>
  )
}

function TargetScore(props) { 
  return (
    <div id = 'TargetScore'>
        target score: {props.targetScore}
    </div>
  )
}

function Hand(props) { 
  let cards = []
  for(let i = 0; i < 16; i += 1) { 
    if(i >= props.cardIds.length) { 
      cards.push(-1); 
    }
    else cards.push(props.cardIds[i]); 
  }
  console.log(cards)
  return (
    <div id = "Hand">
      {
        cards.map((cardId) => <Card cardName={cardId}/>)
        // props.cardIds.map((cardId) => {<div>dlkdkljkkkk</div>} ) does not work. Why??????????
      }
    </div>
  )
}

function EndTurn(props) { 
  return (
    <div id = "EndTurn">
      End Turn
    </div>
  )
}

function Options(props) { 
  return (
    <div id='Options' className = 'flex-vertical-stretch'>
        <Deck numLeft = {11 - props.turn}/>
        <TargetScore targetScore = {props.targetScore}/>
        <Hand cardIds = {props.player[props.you].spellCards}/>
        <EndTurn/>
    </div>
  )
}


function Avatar(props) { 
  return <div>
    Avatear
  </div>
}

function HealthBar(props) { 
  return (
    <div className="health-bar">
      dlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkjdlfjlsdkjgtsldkgjkj
    </div>
  )
}

function Card(props) { 
  return (
    <div className='card'>
      Card: {props.cardName}
    </div>
  )
}

function CardTable(props) { 
  const cards = props.cardIds.map(cardId => <Card cardName = {cardId}/>)
  return (
    <div  className="card-table">
        {cards}
    </div>
  )
}

function Player(props) { 
  if(props.isYou) {
    return (
      <div className='flex-vertical-center'>
        <CardTable cardIds = {props.spellTable} className="card-table"/>
        <CardTable cardIds = {props.onTable} className="card-table"/>
        <HealthBar avatar = {props.avatar} health = {props.health} className="health-bar"/>
      </div>
    )
  }
  else { 
    return (
      <div className='flex-vertical-center'>
        <HealthBar avatar = {props.avatar} health = {props.health} className="health-bar"/>
        <CardTable cardIds = {props.onTable} className="card-table"/>
        <CardTable cardIds = {props.spellTable} className="card-table"/>
      </div>
    )
  }
}

function GameplayPage() { 
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

  // useEffect(() => {
  //   if(lastJsonMessage != null) { 
  //     setGamestate({
  //       ...lastJsonMessage.data
  //     })
  //     youId = gamestate.you; 
  //     opId = 1 - youId; 
  //   }
  // }, [lastJsonMessage])
  
  return (
    <div id = 'GameplayPage' className='Page full-span'>
      <Options {...gamestate} />
      <div className = "full-span vertical-grid-2">
        <Player {...gamestate.player[opId]} isWinner = {opId === gamestate.winner} thisTurn = {opId === gamestate.turn} isYou = {false}/>
        <Player {...gamestate.player[youId]} isWinner = {youId === gamestate.winner} thisTurn = {youId === gamestate.turn} isYou = {true}/>
      </div>
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
    <div id = 'UsernamePage' className='Page full-span flex-center-center'>
      <form onSubmit={_setUsername} className = 'flex-vertical-stretch'>
        <input onChange={(e) => { setFormcontent(e.target.value)}} type="text" placeholder='Enter your name' className='form-input'/>
        <button type="submit" className='form-button'>Let's go!</button>
      </form>
    </div>
  )
}

function LandingPage() { 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true, 
    filter: true, 
    // (jsonMsg) => { console.log(jsonMsg); return jsonMsg.id === ACTION.CREATE_ROOM}, // return true no matter what? 
  }); 

  const {roomcode, setRoomcode} = useContext(roomcodeContext)
  const [formcontent, setFormcontent] = useState('') // const {formcontent, setFormcontent} = useState('')  => bug vcl

  useEffect(() => { 
    console.log("Received message, " , lastJsonMessage); 
    if(lastJsonMessage != null) { 
      if(lastJsonMessage.responseType === RESPONSE_TYPE.ERROR) { 
        alert(lastJsonMessage.data.error); 
      }
      else { 
        setRoomcode(lastJsonMessage.data.roomCode); 
        console.log(lastJsonMessage.data.roomCode)
      }
    }
  }, [lastJsonMessage, readyState])

  const callCreateRoom = useCallback(() => {
    sendJsonMessage({
      id: ACTION.CREATE_ROOM, 
      action: ACTION.CREATE_ROOM, 
      data: {}
    })
  })

  const callJoinRoom = useCallback((e) => { 
    console.log("entering room: 09j9dp")
    sendJsonMessage({ 
        id: ACTION.JOIN_ROOM, 
        action: ACTION.JOIN_ROOM,
        data: {
          roomCode: formcontent,
        }
    })
    e.preventDefault(); 
  })

  return (
    <div id = 'LandingPage' className='Page full-span flex-center-center'>
      <div className='flex-vertical-stretch'>
        <button onClick={callCreateRoom} className = 'form-button'>Create a new room</button>
        <form onSubmit={callJoinRoom} className = 'flex-vertical-stretch'>
          <input onChange={(e) => { setFormcontent(e.target.value)}} type="text" placeholder='Enter a room code' className='form-input'/>
          <button type="submit" className='form-button'>Enter an existing room</button>
        </form>
      </div>
    </div>
  )
}

function App() { 
  const [username, setUsername] = useState('')
  const [roomcode, setRoomcode] = useState('')
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    }, 
    share: true, 
    filter: true, 
  }); // this connection is closed when the object is destructed? 

  useEffect(() => 
    console.log(lastJsonMessage), [lastJsonMessage])

  return ( // wrapping a state hook inside a context just to update? seems really stupid
    <div className='full-span'>
        <usernameContext.Provider value = {{username, setUsername}} >
          <roomcodeContext.Provider value = {{roomcode, setRoomcode}} >
            {roomcode === '' && <LandingPage/>} 
            {/* JSX code must be wrapped inside {} */}
            {roomcode !== '' && username === '' && <UsernamePage/>}
            {roomcode !== '' && username !== '' && <GameplayPage/>}
          </roomcodeContext.Provider>
        </usernameContext.Provider>
      </div>
  );
}

export default App;
