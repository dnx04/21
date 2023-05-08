import { useCallback, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { useState } from 'react';

import { RESPONSE_TYPE, ACTION } from "../constants"
import { WS_URL } from '../constants';

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
        else if(lastJsonMessage.id === ACTION.SET_USERNAME) { 
          setUsername(formUsername); 
        }
        else if(lastJsonMessage.id === ACTION.SET_AVATAR){ 
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

export { 
    UsernamePage
}