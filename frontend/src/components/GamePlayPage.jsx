import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } from "../constants"
import { WS_URL, AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } from '../constants';

import { roomcodeContext } from '../contexts/RoomCodeContext';
import { Options } from './GameOptions';
import { Player } from './Player';

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

export { 
    GameplayPage
}