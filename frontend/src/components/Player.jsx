import { createContext, useCallback, useContext, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { RESPONSE_TYPE, ERROR, ACTION, MOVE_TYPE, SPELL } from "../constants"
import { WS_URL, AVATAR_CNT, SPELL_PER_TURN, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, TIE, GAME_END, ROUND_END, START_HEALTH } from '../constants';

import { CardTable } from './CardTable';

function Avatar(props) { 
    // console.log(AVATARS[`${props.avatar}.png`])
    return <div>
      {/* <a href="https://www.flaticon.com/free-icons/panda-bear" title="panda-bear icons">Panda-bear icons created by Freepik - Flaticon</a> */}
      {/* <img src={require('./assets/avatars/1.png')} style={{backgroundSize: "100% 100%", backgroundRepeat: "no-repeat"}} /> */}
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
      {props.isYou && 'Your health'}{!props.isYou && `${props.username}\'s health`}{': ' + props.health + '/10'}
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
  
function Player(props) { 
    console.log(props)
    const healthBar = (
      <div className='w-100' style = {{height: "5%"}}>
          <HealthBar username={props.username} avatar = {props.avatar} health = {props.health} isYou = {props.isYou} className="health-bar"/>
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

export { 
  Player
}