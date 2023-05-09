# 21 Online

**21 Online** is a web-based online multiplayer variation of Blackjack ~~that has never been seen before.~~ You can play the game online <u>[here](https://game-fhxq.onrender.com/)</u>. 


This is a submission to the *iNTUition v9.0* hackathon.

## Gameplay

On the surface, *21* consists of two players battling in a series of head-to-head blackjack games.

Each player starts the game with 10 health points and 1 attack power. At the start of each round, each player is dealt two cards (1 face up, 1 face down) from their own deck of 11 number cards, consisting of 1 each from 1 to 11.

On each turn, a player can choose to either:
- **Hit:** Draw another number card face-up from their deck (up to a maximum of 5 cards on the table), or
- **Stand:** Pass the turn to their opponent.

Once both players have stood in succession, the face-down cards are revealed, and the winner of the round is determined as follows:

- If *exactly one* player's total goes over the target score of 21 (a *bust*), they lose and their opponent wins the round;
- Otherwise, the person with the closer total to 21 wins the round.
- If both player ends up with the same total, the round ends in a *draw* with no winner.

The winner of each round deals an amount of damage, equal to their attack strength, to their opponent. The person who reduces their opponent's health to 0 wins.

So far so good, right? Well, introducing...

## Spell cards

At the start of each round, players are dealt 3 spell cards that can change the game in various ways (e.g. change their attack strength, draw a specific number card, change the target score,...). They can hold up to 7 spell cards and can play any number of them on each turn before choosing to *hit* or *stand*. 

We believe spell cards will add more layers of strategy to the classic game of blackjack, and is guaranteed to create some chaotic fun!

## Build instructions

You will need Node.js v18 and npm installed.

Clone the project to the directory of your choice, then run these commands inside the directory: 

```
npm run build
npm start
```

This will create a server at `localhost:3001`, from which you can access the game.