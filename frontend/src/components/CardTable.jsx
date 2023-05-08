import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } from "../constants"
import { WS_URL, AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } from '../constants';

function Card(props) { 
    return (
      <div className='card text-center d-flex flex-column align-items-center justify-content-center border-warning' style={{borderWidth: "3px", height: '90%', width: '50%', backgroundColor: props.cardName === -1? 'red': props.cardName == null? '#00296B': 'white'}}>
        <div style = {{}}>{props.cardName}</div>
      </div>
    )
  }
  
function CardTable(props) { 
    while(props.cardIds.length < 5) { 
        props.cardIds.push(null); 
    }
    return (
        <div  className="card-table">
            {props.cardIds.map((cardId) => <div className = "d-flex flex-column justify-content-center"> <Card cardName = {cardId}/> </div>)}
        </div>
    )
}

export { 
    CardTable
}