export const ACTION = {
    SET_USERNAME: 'setUserName',
    CREATE_ROOM: 'createRoom',
    JOIN_ROOM: 'joinRoom',
    PLAY_MOVE: 'playAction'
};

export const RESPONSE_TYPE = {
    ERROR: 'error',
    OK: 'ok',
    ROOM_CODE: 'roomCode',
    GAME_LOG: 'gameLog',
    GAME_STATE: 'gameState'
};

export const MOVE_TYPE = {
    DRAW: 'draw',
    PLAY_SPELL: 'playSpell',
    END_TURN: 'endTurn',
    CONTINUE: 'continue' // Used e.g. after round end to indicate that 
                         // player is ready to start new round
};

export const ERROR = {
    EMPTY_USERNAME: 'Username must not be empty',
    ALREADY_IN_ROOM: 'User is already in a room',
    ROOM_FULL: 'Room is full',
    ROMM_NOT_EXIST: 'Room does not exist'
};
