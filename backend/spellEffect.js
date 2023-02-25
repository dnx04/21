const { SPELL } = require('./constants');

let lasting = {};
lasting[SPELL.BANISH] = 0;
lasting[SPELL.CHANGE_17] = 0;
lasting[SPELL.CHANGE_21] = 0;
lasting[SPELL.CHANGE_24] = 0;
lasting[SPELL.CHANGE_27] = 0;
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

let effect = {};

effect[SPELL.BANISH] = (game) => {
    game.player[1-game.turn].spellTable = [];
};

effect[SPELL.CHANGE_17] = (game) => {
    game.targetScore = 17;
};
effect[SPELL.CHANGE_21] = (game) => {
    game.targetScore = 21;
};
effect[SPELL.CHANGE_24] = (game) => {
    game.targetScore = 24;
};
effect[SPELL.CHANGE_27] = (game) => {
    game.targetScore = 27;
};

function autoDraw(target, game) {
    let t = game.turn;
    let j = -1;
    for (let i in game.player[t].onDeck) if (game.player[t].onDeck[i] === target) j = i;
    if (j!=-1 && game.player[t].onTable.length<5) {
        game.player[t].onTable.push(game.player[t].onDeck.splice(j,j));
    }
}

effect[SPELL.DRAW_3] = (game) => autoDraw(3,game);
effect[SPELL.DRAW_4] = (game) => autoDraw(4,game);
effect[SPELL.DRAW_5] = (game) => autoDraw(5,game);
effect[SPELL.DRAW_6] = (game) => autoDraw(6,game);
effect[SPELL.DRAW_7] = (game) => autoDraw(7,game);

effect[SPELL.GREED] = (game) => {}; // Effect handled in endRound()

effect[SPELL.ONE_UP] = (game) => {

}; // Effect handled in endRound()

module.exports = {
    lasting: lasting,
    effect: effect
}
