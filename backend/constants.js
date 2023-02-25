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
    ONE_UP: "One-Up",  // Increases attack by 1, draw 1 spell (4)
    TWO_UP: "Two-Up",  // Increases attack by 2, return opponent's last drawn card (2)
    DRAW_3: "Draw 3",  // Draw the 3 card (2)
    DRAW_4: "Draw 4",  // Draw the 4 card (2)
    DRAW_5: "Draw 5",  // Draw the 5 card (2)
    DRAW_6: "Draw 6",  // Draw the 6 card (2)
    DRAW_7: "Draw 7",  // Draw the 7 card (2)
    REMOVE: "Remove",  // Return opponent's last drawn card (4)
    RETURN: "Return",  // Return player's last drawn card (4)
    SWAP: "Swap", // Swap the players' last drawn face-up card (3)
    TRADE: "Trade", // Trade 2 other spells at random for 3 from the deck, cannot be used if under 3 (3)
    GREED: "Greed", // Increase attack by (number of opponent spells in hand)/2 rounded up (2)
    BANISH: "Banish", // Remove all opponent spells currently on the table (3)
    CHANGE_17: "Change-Up 17", // Change target score to 17 (3)
    CHANGE_21: "Change-Up 21", // Change target score to 21 (2)
    CHANGE_24: "Change-Up 24", // Change target score to 24 (3)
    CHANGE_27: "Change-Up 27", // Change target score to 27 (3)
    PERFECT_DRAW: "Perfect Draw", // Draw the best possible card from the deck (3)
    SCRAP: "Scrap", // Cancels current round without a winner (4)
    PERFECT_EXECUTION: "Perfect Execution", // Deals 10 damage at the end of a round if you have exactly the target score (2)
}

const ERROR = {
    EMPTY_USERNAME: 'Username must not be empty',
    INVALID_AVATAR: 'Invalid avatar ID',
    ALREADY_IN_ROOM: 'User is already in a room',
    ROOM_FULL: 'Room is full',
    ROOM_NOT_EXIST: 'Room does not exist',
    NOT_YOUR_TURN: 'It is not your turn',
    TABLE_FULL: 'Table is full. You can only draw a maximum of 5 cards per round',
    INVALID_INDEX: 'Invalid card index',
    UNKNOWN_MOVE_TYPE: 'Unknown move type',
    INVALID_TIME: 'You cannot use the Continue move right now'
};

module.exports = {
    SPELL: SPELL,
    ACTION: ACTION,
    RESPONSE_TYPE: RESPONSE_TYPE,
    MOVE_TYPE: MOVE_TYPE,
    ERROR: ERROR,
    AVATAR_CNT: 5,
    SPELL_PER_ROUND: 3,
    MAX_SPELL_IN_HAND: 7,
    MAX_CARD_ON_TABLE: 5,
    ROUND_END: 2,
    TIE: 2,
    GAME_END: -99,
}