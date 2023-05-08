import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } from "../constants"
import { WS_URL, AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } from '../constants';

import { Deck } from './Deck';
import { Hand } from './Hand';

function TargetScore(props) { 
    return (
      <div id = 'TargetScore' className='text-center'>
          Target: {props.targetScore}
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

export { 
    Options
}