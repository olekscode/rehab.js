const NUMBER_OF_ROUNDS = 2;
const STEPS_PER_ROUND = 5;

class ReHabGame {
  constructor(model) {
    this.model = model;
    this.numberOfRounds = NUMBER_OF_ROUNDS;
    this.rounds = [];
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

  nextRound() {
    this.rounds.push(new ReHabRound(this));
  }

  isFinalRound() {
    return this.rounds.length < this.numberOfRounds;
  }

  currentRound() {
    return this.rounds[0];
  }
}

class ReHabRound {
  constructor(game) {
    this.game_ = game;
    this.numberOfSteps = STEPS_PER_ROUND;
    this.steps = [];
  }

  nextStep() {
    this.steps.push(new ReHabStep(this.game_));
  }

  isFinalStep() {
    return this.steps.length < this.numberOfSteps;
  }
}

class ReHabStep {
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

module.exports = { ReHabGame };