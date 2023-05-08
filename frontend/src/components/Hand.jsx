import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } from "../constants"
import { WS_URL, AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } from '../constants';

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

export { 
    Hand
}