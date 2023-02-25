/*
  NOTE: For sanity's sake, all constants will be strings, which is less efficient than ints but easier to debug.
  Rough description of server API:

  Client sends a JSON object = {
    action : string = one of constants.js/ACTION
    data : object = data according to the specification of the sent action
  }

  Server sends a JSON object = {
    responseType : string = one of constants.js/RESPONSE_TYPE
    data : object = data according to the specification of the sent responseType
  }

  Possible actions:
  - SET_USERNAME = {
    username : string = new username to set
  }
  => Possible responses:
    - OK = {}
    - ERROR = {
      error : string = error message, see constants.js/ERROR
    }
  - CREATE_ROOM = {}
  => Possible responses:
    - ROOM_CODE = {
      roomCode : string = 6-character room code of the newly created room
    }
    - ERROR
  - JOIN_ROOM = {
    roomCode : string = room code of the room to join
  }
  => Possible responses:
    - GAME_STATE = {
      player : object[2] = {
        username : string = username of player
        avatar : int = number indicating avatar of player
        onTable : int[] = cards on table for that player
          ontable[0] is the face-down card and is replaced with -1 for the opponent
        spellCards : string[] = spell cards in hand for that player; see constants.js/SPELL.
          For the opponent, this arrray is empty

        health : int = how many health points the player currently has
        attack : int = how many health points the player will deduct from the opponent by winning this round
      }

      turn : int = whose turn it currently is
      you : int = index of player representing you, e.g. you=0 means player[0] corresponds to you
      round : int = current round number
      targetScore : int = target score for this round
    }
    - ERROR
    * GAME_STATE is sent to both players in the room if join is successful, to indicate game start.
  - PLAY_MOVE = {
    moveType : string = one of constans.js/MOVE_TYPE indicating type of move to play
    cardIndex : int = index of spell card to play, if any
  }
  => Possible responses:
    - GAME_STATE
    - ERROR
  Possible server broadcasts:
  - GAME_LOG {
    log: string[] = list of game log lines, to be displayed to client
  }
*/