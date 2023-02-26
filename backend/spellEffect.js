const { SPELL, MAX_SPELL_IN_HAND, MAX_CARD_ON_TABLE, ROUND_END } = require('./constants');

let lasting = {};
lasting[SPELL.BANISH] = 0;
lasting[SPELL.CHANGE_17] = 1;
lasting[SPELL.CHANGE_21] = 1;
lasting[SPELL.CHANGE_24] = 1;
lasting[SPELL.CHANGE_27] = 1;
lasting[SPELL.DRAW_3] = 0;
lasting[SPELL.DRAW_4] = 0;
lasting[SPELL.DRAW_5] = 0;
lasting[SPELL.DRAW_6] = 0;
lasting[SPELL.DRAW_7] = 0;
lasting[SPELL.GREED] = 1;
lasting[SPELL.ONE_UP] = 1;
lasting[SPELL.PERFECT_DRAW] = 0;
lasting[SPELL.PERFECT_EXECUTION] = 1;
lasting[SPELL.REMOVE] = 0;
lasting[SPELL.RETURN] = 0;
lasting[SPELL.SCRAP] = 0;
lasting[SPELL.SWAP] = 0;
lasting[SPELL.TRADE] = 0;
lasting[SPELL.TWO_UP] = 1;


let qty = {};
qty[SPELL.BANISH] = 4;
qty[SPELL.CHANGE_17] = 3;
qty[SPELL.CHANGE_21] = 2;
qty[SPELL.CHANGE_24] = 3;
qty[SPELL.CHANGE_27] = 3;
qty[SPELL.DRAW_3] = 2;
qty[SPELL.DRAW_4] = 2;
qty[SPELL.DRAW_5] = 2;
qty[SPELL.DRAW_6] = 2;
qty[SPELL.DRAW_7] = 2;
qty[SPELL.GREED] = 2;
qty[SPELL.ONE_UP] = 4;
qty[SPELL.PERFECT_DRAW] = 3;
qty[SPELL.PERFECT_EXECUTION] = 2;
qty[SPELL.REMOVE] = 4;
qty[SPELL.RETURN] = 4;
qty[SPELL.SCRAP] = 4;
qty[SPELL.SWAP] = 3;
qty[SPELL.TRADE] = 3;
qty[SPELL.TWO_UP] = 2;

let effect = {};

effect[SPELL.BANISH] = (game) => {
    game.player[1-game.turn].spellTable = [];
};

function change(game) {
    for (p in game.player) {
        let j = -1;
        for (let i=0; i+1<game.player[p].spellTable.length; i++) {
            if (game.player[p].spellTable[i] === CHANGE_17 || game.player[p].spellTable[i] === CHANGE_21
                || game.player[p].spellTable[i] === CHANGE_24 || game.player[p].spellTable[i] === CHANGE_27) {
                    j=i;
                }
        }
        if (j!=-1) game.player[p].spellTable.splice(j,1);
    }
}

effect[SPELL.CHANGE_17] = (game) => change(game);
effect[SPELL.CHANGE_21] = (game) => change(game);
effect[SPELL.CHANGE_24] = (game) => change(game);
effect[SPELL.CHANGE_27] = (game) => change(game);
// Effect handled at recalculateAtkAndTarget()

function autoDraw(target, game) {
    let t = game.turn;
    let j = -1;
    for (let i in game.player[t].onDeck) if (game.player[t].onDeck[i] === target) j = i;
    if (j!=-1 && game.player[t].onTable.length<5) {
        game.player[t].onTable.push(game.player[t].onDeck.splice(j,1)[0]);
    }
}

effect[SPELL.DRAW_3] = (game) => autoDraw(3,game);
effect[SPELL.DRAW_4] = (game) => autoDraw(4,game);
effect[SPELL.DRAW_5] = (game) => autoDraw(5,game);
effect[SPELL.DRAW_6] = (game) => autoDraw(6,game);
effect[SPELL.DRAW_7] = (game) => autoDraw(7,game);

effect[SPELL.GREED] = (game) => {}; // Effect handled at recalculateAtkAndTarget()

effect[SPELL.ONE_UP] = (game) => {
    let t = game.turn;
    if (game.player[t].spellCards.length < MAX_SPELL_IN_HAND) {
        game.player[t].spellCards.push(game.spellCardDeck.shift());
    }
}; // Effect handled at recalculateAtkAndTarget()

effect[SPELL.PERFECT_DRAW] = (game) => {
    let t = game.turn;
    if (game.player[t].onTable.length < MAX_CARD_ON_TABLE) {
        let cardToDraw = game.targetScore;
        for (let g of game.player[t].onTable) cardToDraw -= g;
        let bestCard = game.player[t].onDeck[0];
        for (let g of game.player[t].onDeck) {
            if (g <= cardToDraw && bestCard > cardToDraw) {
                bestCard = g;
            } 
            else if (Math.abs(cardToDraw - g) < Math.abs(cardToDraw - bestCard)) {
                bestCard = g;
            }
        }
        let j = -1;
        for (let i in game.player[t].onDeck) {
            if (game.player[t].onDeck[i] === bestCard) j = i;
        }
        game.player[t].onDeck.splice(j,1);
        game.player[t].onTable.push(bestCard);
    }
};
effect[SPELL.PERFECT_EXECUTION] = (game) => {}; // Effect handled at end of round

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
  }


effect[SPELL.REMOVE] = (game) => {
    let t = game.turn;
    if (game.player[1-t].onTable.length > 1) {
        game.player[1-t].onDeck.push(game.player[1-t].onTable.pop());
        shuffleArray(game.player[1-t].onDeck);
    }
};

effect[SPELL.RETURN] = (game) => {
    let t = game.turn;
    if (game.player[t].onTable.length > 1) {
        game.player[t].onDeck.push(game.player[t].onTable.pop());
        shuffleArray(game.player[t].onDeck);
    }
}

effect[SPELL.SCRAP] = (game) => {
    game.turn = ROUND_END;
    game.winner = 2;
    game.player[0].ready = 0;
    game.player[1].ready = 0;
}

effect[SPELL.SWAP] = (game) => {
    if (game.player[0].onTable.length > 1 && game.player[1].onTable.length > 1) {
        let p0 = game.player[0].onTable.pop();
        let p1 = game.player[1].onTable.pop();
        game.player[1].onTable.push(p0);
        game.player[0].onTable.push(p1);
    }
}

effect[SPELL.TRADE] = (game) => {
    t = game.turn;
    if (game.player[t].spellCards.length >= 2) {
        shuffleArray(game.player[t].spellCards);
        game.player[t].spellCards.pop();
        game.player[t].spellCards.pop();
        game.player[t].spellCards.push(game.spellCardDeck.shift());
        game.player[t].spellCards.push(game.spellCardDeck.shift());
        game.player[t].spellCards.push(game.spellCardDeck.shift());
    }
}

effect[SPELL.TWO_UP] = (game) => {
    let t = game.turn;
    if (game.player[1-t].onTable.length > 1) {
        game.player[1-t].onDeck.push(game.player[1-t].onTable.pop());
        shuffleArray(game.player[1-t].onDeck);
    }
}; // Effect handled at recalculateAtkAndTarget()

module.exports = {
    qty: qty,
    lasting: lasting,
    effect: effect
}
