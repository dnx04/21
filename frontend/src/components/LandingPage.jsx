import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { RESPONSE_TYPE, ERROR, ACTION, SPELL } from "../constants"
import { WS_URL, AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } from '../constants';
import { roomcodeContext } from '../contexts/RoomCodeContext';

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

export { 
    LandingPage
}