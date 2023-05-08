import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } from "../constants"
import { WS_URL, AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } from '../constants';

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

export { 
    Deck
}