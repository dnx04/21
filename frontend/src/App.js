import logo from './logo.svg';
import './App.css';

import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { UsernamePage } from './components/UserNamePage';
import { GameplayPage } from './components/GamePlayPage';
import { LandingPage } from './components/LandingPage';

import { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } from "./constants"
import { WS_URL, AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } from './constants';

import { roomcodeContext } from './contexts/RoomCodeContext';

function importAll(r) {
  let images = {};
   r.keys().forEach((item, index) => { images[item.replace('./', '')] = r(item); });
  return images
 }

// broadcasted to all descendants: ROOM, USERNAME, WebSocket

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
