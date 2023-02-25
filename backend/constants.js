 const ACTION = {
    SET_USERNAME: 'setUsername',
    SET_AVATAR: 'setAvatar',
    CREATE_ROOM: 'createRoom',
    JOIN_ROOM: 'joinRoom',
    PLAY_MOVE: 'playAction'
};

 const RESPONSE_TYPE = {
    ERROR: 'error',
    OK: 'ok',
    ROOM_CODE: 'roomCode',
    GAME_LOG: 'gameLog',
    GAME_STATE: 'gameState'
};

const MOVE_TYPE = {
    DRAW: 'draw',
    PLAY_SPELL: 'playSpell',
    END_TURN: 'endTurn',
    CONTINUE: 'continue' // Used e.g. after round end to indicate that 
                         // player is ready to start new round
};

const SPELL = {
    
}

const ERROR = {
    EMPTY_USERNAME: 'Username must not be empty',
    INVALID_AVATAR: 'Invalid avatar ID',
    ALREADY_IN_ROOM: 'User is already in a room',
    ROOM_FULL: 'Room is full',
    ROOM_NOT_EXIST: 'Room does not exist',
    NOT_YOUR_TURN: 'It is not your turn',
    TABLE_FULL: 'Table is full. You can only draw a maximum of 5 cards per round',
    INVALID_INDEX: 'Invalid card index'
};

module.exports = {
    ACTION: ACTION,
    RESPONSE_TYPE: RESPONSE_TYPE,
    MOVE_TYPE: MOVE_TYPE,
    ERROR: ERROR,
    AVATAR_CNT: 5,
    SPELL_PER_ROUND: 3,
    MAX_SPELL_IN_HAND: 7,
}