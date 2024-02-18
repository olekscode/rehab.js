const HARVESTERS_PER_FAMILY = 4;
const NUMBER_OF_FAMILIES = 5;
const NUMBER_OF_ROWS = 4;
const NUMBER_OF_COLUMNS = 5;

class ReHabModel {
  constructor() {
    this.numberOfRows = NUMBER_OF_ROWS;
    this.numberOfColumns = NUMBER_OF_COLUMNS;

    this.cells = [];
    this.families = [];

    this.initializeEmptyCells_();
    this.initializeCellNeighbours_();
    this.initializeFamilies_();
  }

  initializeEmptyCells_() {
    for (let i = 0; i < this.numberOfRows * this.numberOfColumns; i++) {
      this.cells.push(new ReHabCell());
    }
  }

  initializeCellNeighbours_() {
    for (let i = 0; i < this.numberOfRows; i++) {
      for (let j = 0; j < this.numberOfColumns; j++) {
        let cell = this.cellAt(i, j);

        // North neighbour
        if (i > 0)
          cell.addNeighbourCell(this.cellAt(i - 1, j));

        // South neighbour
        if (i < this.numberOfRows - 1)
          cell.addNeighbourCell(this.cellAt(i + 1, j));

        // East neighbour
        if (j < this.numberOfColumns - 1)
          cell.addNeighbourCell(this.cellAt(i, j + 1));

        // West neighbour
        if (j > 0)
          cell.addNeighbourCell(this.cellAt(i, j - 1));

        // North-East neighbour
        if (i > 0 && j < this.numberOfColumns - 1)
          cell.addNeighbourCell(this.cellAt(i - 1, j + 1));

        // North-West neighbour
        if (i > 0 && j > 0)
          cell.addNeighbourCell(this.cellAt(i - 1, j - 1));

        // South-East neighbour
        if (i < this.numberOfRows - 1 && j < this.numberOfColumns - 1)
          cell.addNeighbourCell(this.cellAt(i + 1, j + 1));

        // South-West neighbour
        if (i < this.numberOfRows - 1 && j > 0)
          cell.addNeighbourCell(this.cellAt(i + 1, j - 1));
      }
    }
  }

  initializeFamilies_() {
    for (let i = 0; i < NUMBER_OF_FAMILIES; i++) {
      this.families.push(new ReHabFamily());
    }
  }

  initializeBiomassWithMatrix(matrix) {
    matrix.map((value, i) =>
      this.cells[i].biomass = value
    );
  }

  cellAt(row, column) {
    return this.cells[row * this.numberOfColumns + column];
  }

  step() {
    this.cells.forEach((cell) => cell.step());
  }

  bringAllHarvestersHome() {        
    this.cells.forEach((cell) => cell.removeHarvesters());
  }
}

class ReHabCell {
  constructor() {
    this.biomass = 0;
    this.harvesters = [];
    this.numberOfBirds = 0;
    this.neighbourCells_ = [];
    this.unexploitedCounter_ = 0;
    this.isProtectedArea_ = false;
  }

  isProtectedArea() {
    return this.isProtectedArea_;
  }

  makeProtectedArea() {
    this.isProtectedArea_ = true;
  }

  hasHarvesters() {
    return this.harvesters.length > 0;
  }

  removeHarvesters() {  
    this.harvesters = [];
  }

  addNeighbourCell(cell) {
    this.neighbourCells_.push(cell);
  }

  step() {
    this.updateUnexploitedCounter_();
    this.breedBirds_();
    this.distributeHarvestAndRegenerateBiomass_();
  }

  updateUnexploitedCounter_() {
    this.hasHarvesters() ?
      this.unexploitedCounter_ = 0 :
      this.unexploitedCounter_++;
  }

  distributeHarvestAndRegenerateBiomass_() {
    if (this.harvesters.length === 0) {
      if (this.unexploitedCounter_ === 1) {
        if (this.biomass < 3) {
          this.biomass++;
        }
      }
      else if (this.unexploitedCounter_ > 2) {
        if (this.biomass > 0) {
          this.biomass--;
        }
      }
      // else no change
    }
    else if (this.harvesters.length === 1) {
      this.harvesters[0].harvestedBiomass = Math.min(this.biomass, 2);
      // regeneration = harvested amount (so no change)
    }
    else {
      if (this.biomass === 3) {
        this.harvesters[0].harvestedBiomass = 2;
        this.harvesters[1].harvestedBiomass = 1;

        if (this.harvesters.length === 2) {
          this.biomass = 1; // regenerate 1 if 2 harvesters collect 3 biomass
        }
        else {
          this.biomass = 0;
        }
      }
      else {
        this.harvesters[0].harvestedBiomass = this.biomass;
        this.biomass = 0;
      }
    }
  }

  breedBirds_() {
    // Occupied cells and cells with not evough biomass have no birds
    if (this.hasHarvesters() || this.biomass < 2) {
      this.numberOfBirds = 0;
      return;
    }

    const unoccupiedNeighbours =
      this.neighbourCells_.filter((cell) => !cell.hasHarvesters());
      
    const proportionOfUnoccupiedNeighbours =
      unoccupiedNeighbours.length / this.neighbourCells_.length;

    // Cells with more than 80% unoccupied neighbours have 2 birds
    if (proportionOfUnoccupiedNeighbours >= 0.8) {
      this.numberOfBirds = 2;
    }
    // Cells with more than 50% and less than 80%
    // of unoccupied neighbours have 1 bird
    else if (proportionOfUnoccupiedNeighbours > 0.5) {
      this.numberOfBirds = 1;
    }
    else {
      this.numberOfBirds = 0;
    }
  }
}

class ReHabHarvester {
  constructor(id) {
    this.id = id;
    this.harvestedBiomass = 0;
  }

  goToCell(cell) {
    cell.harvesters.push(this);
  }
}

class ReHabFamily {
  constructor() {
    this.harvesters = [];

    this.initializeHarvesters_();
  }

  initializeHarvesters_() {
    for (let i = 0; i < HARVESTERS_PER_FAMILY; i++) {
      this.harvesters.push(new ReHabHarvester(i + 1));
    }
  }

  harvestedBiomass() {
    return this.harvesters
      .reduce((acc, harvester) => acc + harvester.harvestedBiomass, 0);
  }
}

module.exports = { ReHabModel, ReHabCell, ReHabHarvester, ReHabFamily };