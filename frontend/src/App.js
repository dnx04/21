import logo from './logo.svg';
import './App.css';

import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

// import avatar1 from "../public/avatars"

const { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } = require('./constants');
const { AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } = require('./constants');

const WS_URL = 'ws://localhost:3080';

function importAll(r) {
  let images = {};
   r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
  return images
 }
// const AVATARS = importAll(require.context('../public/avatars', false, /\.(png|jpe?g|svg)$/));
// const SPELLCARDS = importAll(require.context('../public/spell_cards', false, /\.(png|jpe?g|svg)$/));


// console.log(AVATARS)
// console.log(SPELLCARDS)


// broadcasted to all descendants: ROOM, USERNAME, WebSocket

const roomcodeContext = createContext({})

function Deck(props) { 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true, 
    filter: (wrappedMsg) => { 
      let jsonMsg = JSON.parse(wrappedMsg.data); 
      return jsonMsg.id === MOVE_TYPE.DRAW; 
    }, 
  });

  useEffect(() => { 
    if(lastJsonMessage != null) { 
      if(lastJsonMessage.responseType === RESPONSE_TYPE.ERROR) { 
        alert(lastJsonMessage.data.error); 
      }
    }
  }, [lastJsonMessage, readyState])

  const callDraw= useCallback(() => {
    sendJsonMessage({
      id: MOVE_TYPE.DRAW, 
      action: ACTION.PLAY_MOVE, 
      data: { 
        moveType: MOVE_TYPE.DRAW, 
      }
    })
  })

  return (
    <button onClick = {callDraw} id = "Deck"  className='bg-white btn-primary'>
      Cards left: {props.numLeft}
    </button>
  )
}

function TargetScore(props) { 
  return (
    <div id = 'TargetScore' className='text-center'>
        Target: {props.targetScore}
    </div>
  )
}

function Hand(props) { 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true, 
    filter: (wrappedMsg) => { 
      let jsonMsg = JSON.parse(wrappedMsg.data); 
      return jsonMsg.id === MOVE_TYPE.PLAY_SPELL; 
    }, 
  });

  let cards = []
  for(let i = 0; i < 16; i += 1) { 
    if(i >= props.cardIds.length) { 
      cards.push(""); 
    }
    else cards.push(props.cardIds[i]); 
  }

  useEffect(() => { 
    if(lastJsonMessage != null) { 
      if(lastJsonMessage.responseType === RESPONSE_TYPE.ERROR) { 
        alert(lastJsonMessage.data.error); 
      }
    }
  }, [lastJsonMessage, readyState])

  const callPlaySpell = useCallback((index) => {
    sendJsonMessage({
      id: MOVE_TYPE.PLAY_SPELL, 
      action: ACTION.PLAY_MOVE, 
      data: { 
        moveType: MOVE_TYPE.PLAY_SPELL, 
        cardIndex: index, 
      }
    })
  })

  return (
    <div id = "Hand">
      {
        cards.map((cardName, index) => <button onClick = {() => callPlaySpell(index)} className='border-1 bg-white w-100 h-100'>{cardName}</button>)
      }
    </div>
  )
}

function EndTurn(props) { 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true, 
    filter: (wrappedMsg) => { 
      let jsonMsg = JSON.parse(wrappedMsg.data); 
      return jsonMsg.id === MOVE_TYPE.END_TURN; 
    }, 
  });

  useEffect(() => { 
    if(lastJsonMessage != null) { 
      if(lastJsonMessage.responseType === RESPONSE_TYPE.ERROR) { 
        alert(lastJsonMessage.data.error); 
      }
    }
  }, [lastJsonMessage, readyState])

  const callEndTurn = useCallback(() => {
    sendJsonMessage({
      id: MOVE_TYPE.END_TURN, 
      action: ACTION.PLAY_MOVE, 
      data: { 
        moveType: MOVE_TYPE.END_TURN, 
      }
    })
  })

  return (
    <button onClick = {callEndTurn} id = "EndTurn">
      End turn
    </button>
  )
}

function Continue(props) { 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true, 
    filter: (wrappedMsg) => { 
      let jsonMsg = JSON.parse(wrappedMsg.data); 
      return jsonMsg.id === MOVE_TYPE.CONTINUE; 
    }, 
  });

  useEffect(() => { 
    if(lastJsonMessage != null) { 
      if(lastJsonMessage.responseType === RESPONSE_TYPE.ERROR) { 
        alert(lastJsonMessage.data.error); 
      }
    }
  }, [lastJsonMessage, readyState])

  const callContinue = useCallback(() => {
    sendJsonMessage({
      id: MOVE_TYPE.CONTINUE, 
      action: ACTION.PLAY_MOVE, 
      data: { 
        moveType: MOVE_TYPE.CONTINUE, 
      }
    })
  })

  return (
    <button onClick = {callContinue} id = "EndTurn">
      Next round
    </button>
  )
}


function Options(props) { 
  return (
    <div id='Options' className = 'd-flex flex-column justify-content-center align-items-stretch'>
        <TargetScore targetScore = {props.targetScore} yourTurn = {props.turn === props.you}/>
        <Deck numLeft = {11 - props.turn} yourTurn = {props.turn === props.you}/>
        <Hand cardIds = {props.player[props.you].spellCards} yourTurn = {props.turn === props.you}/>
        {props.turn == 2? <Continue/> : <EndTurn/>}
    </div>
  )
}


function Avatar(props) { 
  // console.log(AVATARS[`${props.avatar}.png`])
  return <div>
    {/* <a href="https://www.flaticon.com/free-icons/panda-bear" title="panda-bear icons">Panda-bear icons created by Freepik - Flaticon</a> */}
    <img src={require('./assets/avatars/1.png')} style={{backgroundSize: "100% 100%", backgroundRepeat: "no-repeat"}} />
  </div>
}

function HealthBar(props) { 
  // const avatar = <div style={{width: '5%', height: "100%"}}>
    // <Avatar avatar={props.avatar}/>
  // </div>
  const lost = (<div className='h-100 text-center' style={{width: (10-props.health) * 10 + "vw", backgroundColor: "#00296B", color: "#00296B"}}>
    {100 - props.health + "%"}
  </div>
  )
  
  const health_bg = props.isYou?  "linear-gradient(to right, red , #00296B)": "linear-gradient(to right, #00296B, red)"
  const health = (<div className='h-100 text-white text-center' style={{width: props.health * 10 + "vw", backgroundImage: health_bg}}>
    {props.health}
  </div>
  )

  return (
    <div className='h-100 w-100 d-flex flex-row'>
      {/* {props.isYou && avatar} */}
      <div className='h-100 d-flex flex-row' style={{width: '100%'}}>
        {props.isYou && health}
        {props.isYou && lost}
        {!props.isYou && lost}
        {!props.isYou && health}
      </div>
      {/* {!props.isYou && avatar} */}
    </div>
  )
}

function Card(props) { 
  return (
    <div className='card text-center d-flex flex-column align-items-center justify-content-center border-warning' style={{borderWidth: "3px", height: '90%', width: '50%', backgroundColor: props.cardName === -1? 'red': 'white'}}>
      <div style = {{}}>{props.cardName}</div>
    </div>
  )
}

function CardTable(props) { 
  return (
    <div  className="card-table">
        {props.cardIds.map((cardId) => <div className = "d-flex flex-column justify-content-center"> <Card cardName = {cardId}/> </div>)}
    </div>
  )
}

function Player(props) { 
  const healthBar = (
    <div className='w-100' style = {{height: "5%"}}>
        <HealthBar avatar = {props.avatar} health = {props.health} isYou = {props.isYou} className="health-bar"/>
      </div>
  )
  const spellTable = (
    <div className='w-75' style = {{height: 47.5 + "%"}}>
          <CardTable cardIds = {props.spellTable} className="card-table"/>
        </div>
  )

  const onTable = (<div className='w-75' style = {{height: 47.5 + "%"}}>
    <CardTable cardIds = {props.onTable} className="card-table"/>
  </div>
  )
  return (
    <div className='w-100 h-100 d-flex flex-column justify-content-center align-items-center' style={{backgroundColor: '#00296B'}}>
      {props.isYou && spellTable}
      {props.isYou && onTable}
      {props.isYou && healthBar}
      {!props.isYou && healthBar}
      {!props.isYou && onTable}
      {!props.isYou && spellTable}
    </div>
  )
}

function GameplayPage() { 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true, 
    filter: (wrappedMsg) => { 
      let jsonMsg = JSON.parse(wrappedMsg.data); 
      return jsonMsg.responseType === RESPONSE_TYPE.GAME_STATE; 
    }, 
  });

  const {roomcode, setRoomcode} = useContext(roomcodeContext) // nham [] voi {} VLKLDKFDFD DMM thang ccc
  const [gamestate, setGamestate] = useState(null)

  // const [gamestate, setGamestate] = useState({
  //   player: [
  //     {
  //       username : 'you', 
  //       avatar : 0, 
  //       onTable : [1, 2], 
  //       spellTable : ["Draw 7"], 
  //       spellCards : ["Draw 7"], 
  //       health : 30, 
  //       attack : 50, 
  //     }, 
  //     {
  //       username : 'op', 
  //       avatar : 1, 
  //       onTable : [-1, 3], 
  //       spellTable : ["Draw 6"], 
  //       spellCards : [-1], 
  //       health : 60, 
  //       attack : 20, 
  //     }
  //   ], 
  //   turn : 1, 
  //   winner: -1, 
  //   you: 0, 
  //   round: 1, 
  //   targetScore: 14, 
  // })

  useEffect(() => {
    if(lastJsonMessage != null) { 
      setGamestate({
        ...lastJsonMessage.data
      })
    }
  }, [lastJsonMessage])
  
  return (
    <div id = 'GameplayPage' className='w-100 h-100 p-0 m-0 bg-light'>
      { 
        gamestate != null && 
        <div className='w-100 h-100 p-0 m-0'>
          <Options {...gamestate} />
          <div className='w-100 h-100 p-0 m-0'>
            <div className='h-50 w-100'>
              <Player {...gamestate.player[1 - gamestate.you]} isWinner = {gamestate.you !== gamestate.winner} thisTurn = {gamestate.you !== gamestate.turn} isYou = {false}/>
            </div>
            <div className='h-50 w-100'>
              <Player {...gamestate.player[gamestate.you]} isWinner = {gamestate.you === gamestate.winner} thisTurn = {gamestate.you === gamestate.turn} isYou = {true}/>
            </div>
           </div>
        </div>
      }
      {
        gamestate == null && 
        <div className='w-100 h-100 d-flex flex-column align-items-center justify-content-center'>
          <div className=''>Room code: {roomcode} </div>
          <div className=''>Waiting for opponent...</div>
        </div>
      }
    </div>
  )
}

function UsernamePage(props) { 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true, 
    filter: (wrappedMsg) => { 
      let jsonMsg = JSON.parse(wrappedMsg.data); 
      return jsonMsg.id === ACTION.SET_USERNAME || jsonMsg.id === ACTION.SET_AVATAR; 
    }, 
  }); 

  const username = props.username, 
    setUsername = props.setUsername, 
    avatar = props.avatar, 
    setAvatar = props.setAvatar; 

  const [formUsername, setFormUsername] = useState('')
  const [formAvatar, setFormAvatar] = useState(null)

  useEffect(() => { 
    if(lastJsonMessage != null) { 
      if(lastJsonMessage.responseType === RESPONSE_TYPE.ERROR) { 
        alert(lastJsonMessage.data.error); 
      }
      else if(lastJsonMessage.id == ACTION.SET_USERNAME) { 
        setUsername(formUsername); 
      }
      else if(lastJsonMessage.id == ACTION.SET_AVATAR){ 
        setAvatar(formAvatar); 
      }
    }
  }, [lastJsonMessage, readyState])

  const callSendInfo = useCallback((e) => {
    sendJsonMessage({
      id: ACTION.SET_USERNAME, 
      action: ACTION.SET_USERNAME, 
      data: {
        username: formUsername, 
      }
    })
    let avatarrr = Math.floor((Math.random() * 4))
    sendJsonMessage({
      id: ACTION.SET_AVATAR, 
      action: ACTION.SET_AVATAR, 
      data: {
        avatar: avatarrr
      }
    })
    e.preventDefault(); // HUGE BUG BRO
  })

  return (
    <div id = 'UsernamePage' className='full-span flex-center-center' style={{backgroundColor: '#eee'}}>
      <form onSubmit={callSendInfo} className='d-flex flex-column align-items-stretch'>
        <div className='form-group'>
          <input onChange={(e) => { setFormUsername(e.target.value)}} type="text" placeholder='Enter your name' className='form-control'/>
          {/* <input onChange={(e) => { setFormAvatar(e.target.value)}} type="text" placeholder='Enter your name' className='form-control'/> */}
        </div>
        <button type="submit" className='btn btn-warning'>Let's go!</button>
      </form>
    </div>
  )
}

function LandingPage() { 
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    share: true, 
    filter: (wrappedMsg) => { 
      let jsonMsg = JSON.parse(wrappedMsg.data)
      return jsonMsg.id === ACTION.CREATE_ROOM || jsonMsg.id === ACTION.JOIN_ROOM}, 
  }); 

  const {roomcode, setRoomcode} = useContext(roomcodeContext)
  const [formcontent, setFormcontent] = useState('') // const {formcontent, setFormcontent} = useState('')  => bug vcl

  useEffect(() => { 
    if(lastJsonMessage != null) { 
      if(lastJsonMessage.responseType === RESPONSE_TYPE.ERROR) { 
        alert(lastJsonMessage.data.error); 
      }
      else {
        setRoomcode(lastJsonMessage.data.roomCode); 
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
    <div id = 'LandingPage' className='mw-100 h-100 m-0 p-0 d-flex justify-content-center align-items-center' style={{backgroundColor: '#eee'}}>
      <div className = 'd-flex flex-column align-items-stretch'>
        <form onSubmit={callJoinRoom} className='d-flex flex-column align-items-stretch'>
          <div className='form-group'>
            <input onChange={(e) => { setFormcontent(e.target.value)}} type="text" placeholder='Enter a room code' className='form-control'/>
          </div>
          
          <button type="submit" className='btn btn-warning'>Enter an existing room</button>
        </form>
        <hr className="hr" /> 
        <button onClick={callCreateRoom} className = 'btn btn-warning'>Create a new room</button>
      </div>
    </div>
  )
}

function App() { 
  const [username, setUsername] = useState('')
  const [roomcode, setRoomcode] = useState('')
  const [avatar, setAvatar] = useState(null)
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(WS_URL, {
    onOpen: () => {
    }, 
    share: true, 
    filter: true, 
  }); // this connection is closed when the object is destructed? 

  useEffect(() => 
    console.log("latest message: ", lastJsonMessage), [lastJsonMessage])

  return ( // wrapping a state hook inside a context just to update? seems really stupid
    <div className='mw-100 h-100 m-0 p-0'>
        <roomcodeContext.Provider value = {{roomcode, setRoomcode}} >
          {username === '' && <UsernamePage {...{username, setUsername, roomcode, setRoomcode}}/>}
          {roomcode === '' && username !== '' && <LandingPage/>}
          {roomcode !== '' && username !== '' && <GameplayPage/>}
        </roomcodeContext.Provider>
      </div>
  );
}

export default App;
