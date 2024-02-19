const NUMBER_OF_TURNS = 2;
const ROUNDS_PER_TURN = 5;

class ReHabGame {
  constructor(model) {
    this.model = model;
    this.numberOfTurns = NUMBER_OF_TURNS;
    this.turns = [];
    this.players = [];

    this.organizationInfo = {
      name: '',
      typeOfBusiness: '',
      isPublic: true,
      description: ''
    };
  }

  addPlayer(name) {
    this.players.push(new ReHabPlayer(name));
  }

  nextTurn() {
    this.turns.push(new ReHabTurn(this));
  }

  isFinalTurn() {
    return this.turns.length < this.numberOfTurns;
  }

  currentTurn() {
    return this.turns[0];
  }
}

class ReHabTurn {
  constructor(game) {
    this.game_ = game;
    this.numberOfRounds = ROUNDS_PER_TURN;
    this.rounds = [];
  }

  nextRound() {
    this.rounds.push(new ReHabRound(this.game_));
  }

  isFinalRound() {
    return this.rounds.length < this.numberOfRounds;
  }
}

class ReHabRound {
  constructor(game) {
    this.game_ = game;
  }
}

class ReHabPlayer {
  constructor(name) {
    this.name = name;
    this.isParkManager_ = false;
    this.family
  }

  makeParkManager() {
    this.isParkManager = true;
  }

  isParkManager() {
    return this.isParkManager_;
  }
}

module.exports = { ReHabGame, ReHabTurn, ReHabRound, ReHabPlayer };