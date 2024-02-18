const { ReHabModel, ReHabCell, ReHabHarvester } = require('./model');

const INITIAL_MATRIX = [
  1, 1, 2, 1, 1,
  2, 0, 2, 3, 2,
  1, 3, 1, 2, 1,
  1, 3, 1, 0, 2];

let model, redFamily, greenFamily, blueFamily, blackFamily, pinkFamily;

beforeEach(() => {
  model = new ReHabModel();
  model.initializeBiomassWithMatrix(INITIAL_MATRIX);

  [ redFamily,
    greenFamily,
    blueFamily,
    blackFamily,
    pinkFamily
  ] = model.families;
});

const sendHarvestersOfFamily_ = (family, cellCoordinates) => {
  cellCoordinates.forEach((pair, i) => {
    const harvester = family.harvesters[i];
    const cell = model.cellAt(pair[0], pair[1]);
    harvester.goToCell(cell);
  });
};

const sendHarvesters = () => {
  sendHarvestersOfFamily_(redFamily, [[0, 0], [1, 3], [1, 4], [3, 1]]);
  sendHarvestersOfFamily_(greenFamily, [[0, 2], [1, 3], [2, 2], [3, 1]]);
  sendHarvestersOfFamily_(blueFamily, [[1, 3], [2, 2], [3, 2], [3, 3]]);
  sendHarvestersOfFamily_(blackFamily, [[0, 2], [0, 4], [1, 2], [3, 0]]);
  sendHarvestersOfFamily_(pinkFamily, [[1, 1], [2, 0], [2, 4], [3, 3]]);
};

test('New model has 20 cells', () => {
  expect(model.cells.length).toBe(20);
});

test('New model has 5 families', () => {
  expect(model.families.length).toBe(5);
});

test('Number of rows is 4', () => {
  expect(model.numberOfRows).toBe(4);
});

test('Number of columns is 5', () => {
  expect(model.numberOfColumns).toBe(5);
});

// Testing a private method - questionable practice
test('Cells have correct number of neighbours', () => {
  const cellNeighbourNumbers = model.cells.map((cell) => cell.neighbourCells_.length);
  const expectedCellNeighbourNumbers = [
    3, 5, 5, 5, 3,
    5, 8, 8, 8, 5,
    5, 8, 8, 8, 5,
    3, 5, 5, 5, 3];

  expect(cellNeighbourNumbers).toStrictEqual(expectedCellNeighbourNumbers);
});

test('Biomass is correctly initalized', () => {
  const actualBiomass = model.cells.map((cell) => cell.biomass);
  expect(actualBiomass).toStrictEqual(INITIAL_MATRIX);
});

test('Can access cell by row and column', () => {
  const accessedCell = model.cellAt(1, 2);
  expect(accessedCell).toBe(model.cells[7]);
  expect(accessedCell.biomass).toBe(2);
});

test('By default, no cells are marked as protected area', () => {
  model.cells.forEach((cell) => 
    expect(cell.isProtectedArea()).toBeFalsy());
});

test('Can turn cells into protected area', () => {
  const c1 = model.cellAt(0, 1);
  const c2 = model.cellAt(0, 2);
  const c3 = model.cellAt(1, 2);

  c1.makeProtectedArea();
  c2.makeProtectedArea();
  c3.makeProtectedArea();

  const protectedAreaMap = model.cells.map((cell) => cell.isProtectedArea());
  const expectedProtectedAreaMap = [
    false, true, true, false, false,
    false, false, true, false, false,
    false, false, false, false, false,
    false, false, false, false, false ];

  expect(protectedAreaMap).toStrictEqual(expectedProtectedAreaMap);
});

test('One step on empty model correctly regenerates the biomass', () => {
  model.step();
  const actualBiomass = model.cells.map((cell) => cell.biomass);
  const expectedBiomass = [
    2, 2, 3, 2, 2,
    3, 1, 3, 3, 3,
    2, 3, 2, 3, 2,
    2, 3, 2, 1, 3];

  expect(actualBiomass).toStrictEqual(expectedBiomass);
});

test('Two steps on empty model correctly regenerate the biomass', () => {
  model.step();
  model.step();

  const actualBiomass = model.cells.map((cell) => cell.biomass);
  const expectedBiomass = [
    2, 2, 3, 2, 2,
    3, 1, 3, 3, 3,
    2, 3, 2, 3, 2,
    2, 3, 2, 1, 3];

  expect(actualBiomass).toStrictEqual(expectedBiomass);
});

test('Three steps on empty model correctly regenerate the biomass', () => {
  model.step();
  model.step();
  model.step();
  
  const actualBiomass = model.cells.map((cell) => cell.biomass);
  const expectedBiomass = [
    1, 1, 2, 1, 1,
    2, 0, 2, 2, 2,
    1, 2, 1, 2, 1,
    1, 2, 1, 0, 2];

  expect(actualBiomass).toStrictEqual(expectedBiomass);
});

test('Four steps on empty model correctly regenerate the biomass', () => {
  model.step();
  model.step();
  model.step();
  model.step();
  
  const actualBiomass = model.cells.map((cell) => cell.biomass);
  const expectedBiomass = [
    0, 0, 1, 0, 0,
    1, 0, 1, 1, 1,
    0, 1, 0, 1, 0,
    0, 1, 0, 0, 1];

  expect(actualBiomass).toStrictEqual(expectedBiomass);
});

test('Number of harvesters of every cell in empty model is 0', () => {
  model.cells.forEach((cell) =>
    expect(cell.harvesters.length).toBe(0));
});

test('Number of harvesters in non-empty model is correct', () => {
  sendHarvesters();

  const actualHarvesterNumbers = model.cells
    .map((cell) => cell.harvesters.length);

  const expectedHarvesterNumbers = [
    1, 0, 2, 0, 1,
    0, 1, 1, 3, 1,
    1, 0, 2, 0, 1,
    1, 2, 1, 2, 0];

  expect(actualHarvesterNumbers).toStrictEqual(expectedHarvesterNumbers);
});

test('Empty cell has no harvesters', () => {
  expect(model.cellAt(0, 0).hasHarvesters()).toBeFalsy();
});

test('Non-empty cell has harvesters', () => {
  sendHarvesters();
  expect(model.cellAt(0, 0).hasHarvesters()).toBeTruthy();
});

test('Cell has reference to the harvesters located on it', () => {
  const harvester1 = redFamily.harvesters[0];
  const harvester2 = redFamily.harvesters[1];
  const cell = model.cellAt(1, 2);

  harvester1.goToCell(cell);
  harvester2.goToCell(cell);;

  expect(cell.harvesters).toStrictEqual([harvester1, harvester2]);
});

test('Can remove all harvesters from cell', () => {
  sendHarvesters();
  const cell = model.cellAt(1, 3);
  const harvesters = cell.harvesters;

  cell.removeHarvesters();
  expect(cell.hasHarvesters()).toBeFalsy();
});

test('Can bring all harvesters home', () => {
  sendHarvesters();
  model.bringAllHarvestersHome();

  model.cells.forEach((cell) => 
    expect(cell.hasHarvesters()).toBeFalsy());
});

test('One step on non-empty model correctly regenerates the biomass', () => {
  sendHarvesters();
  model.step();

  const actualBiomass = model.cells.map((cell) => cell.biomass);
  const expectedBiomass = [
    1, 2, 0, 2, 1,
    3, 0, 2, 0, 2,
    1, 3, 0, 3, 1,
    1, 1, 1, 0, 3];

  expect(actualBiomass).toStrictEqual(expectedBiomass);
});

test('Two steps on non-empty model correctly regenerate the biomass', () => {
  sendHarvesters();
  model.step();
  model.step();

  const actualBiomass = model.cells.map((cell) => cell.biomass);
  const expectedBiomass = [
    1, 2, 0, 2, 1,
    3, 0, 2, 0, 2,
    1, 3, 0, 3, 1,
    1, 0, 1, 0, 3];

  expect(actualBiomass).toStrictEqual(expectedBiomass);
});

test('Three steps on non-empty model correctly regenerate the biomass', () => {
  sendHarvesters();
  model.step();
  model.step();
  model.step();

  const actualBiomass = model.cells.map((cell) => cell.biomass);
  const expectedBiomass = [
    1, 1, 0, 1, 1,
    2, 0, 2, 0, 2,
    1, 2, 0, 2, 1,
    1, 0, 1, 0, 2];

  expect(actualBiomass).toStrictEqual(expectedBiomass);
});

test('Four steps on non-empty model correctly regenerate the biomass', () => {
  sendHarvesters();
  model.step();
  model.step();
  model.step();
  model.step();

  const actualBiomass = model.cells.map((cell) => cell.biomass);
  const expectedBiomass = [
    1, 0, 0, 0, 1,
    1, 0, 2, 0, 2,
    1, 1, 0, 1, 1,
    1, 0, 1, 0, 1];

  expect(actualBiomass).toStrictEqual(expectedBiomass);
});

test('Bird breeding on empty model', () => {
  model.step();

  const actualBirdNumbers = model.cells.map((cell) => cell.numberOfBirds);
  const expectedBirdNumbers = [
    0, 0, 2, 0, 0,
    2, 0, 2, 2, 2,
    0, 2, 0, 2, 0,
    0, 2, 0, 0, 2];

  expect(actualBirdNumbers).toStrictEqual(expectedBirdNumbers);
});

test('Bird breeding on non-empty model', () => {
  sendHarvesters();
  model.step();

  const actualBirdNumbers = model.cells.map((cell) => cell.numberOfBirds);
  const expectedBirdNumbers = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0];

  expect(actualBirdNumbers).toStrictEqual(expectedBirdNumbers);
});

test('Bird breeding with few harvesters', () => {
  sendHarvestersOfFamily_(redFamily, [[0, 0], [0, 1], [0, 2]]);
  sendHarvestersOfFamily_(greenFamily, [[2, 0], [2, 4]]);
  model.step();

  const actualBirdNumbers = model.cells.map((cell) => cell.numberOfBirds);
  const expectedBirdNumbers = [
    0, 0, 0, 0, 0,
    0, 0, 1, 1, 2,
    0, 2, 0, 2, 0,
    0, 2, 0, 0, 1];

  expect(actualBirdNumbers).toStrictEqual(expectedBirdNumbers);
});

const biomassHarvestedFromCell = (numberOfHarvesters, biomassInCell) => {
  const cell = new ReHabCell();

  const harvesters = Array(numberOfHarvesters)
    .fill(null)
    .map((_) => new ReHabHarvester());

  cell.biomass = biomassInCell;
  harvesters.forEach((harvester) => harvester.goToCell(cell));
  cell.step();

  return harvesters.map((harvester) => harvester.harvestedBiomass);
}

test('One harvester collects 0 biomass in a cell with 0 biomass', () => {
  const harvest = biomassHarvestedFromCell(1, 0);
  expect(harvest).toStrictEqual([0]);
});

test('One harvester collects 1 biomass in a cell with 1 biomass', () => {
  const harvest = biomassHarvestedFromCell(1, 1);
  expect(harvest).toStrictEqual([1]);
});

test('One harvester collects 2 biomass in a cell with 2 biomass', () => {
  const harvest = biomassHarvestedFromCell(1, 2);
  expect(harvest).toStrictEqual([2]);
});

test('One harvester collects 2 biomass in a cell with 3 biomass', () => {
  const harvest = biomassHarvestedFromCell(1, 3);
  expect(harvest).toStrictEqual([2]);
});

test('Two harvesters collect [0,0] biomass in a cell with 0 biomass', () => {
  const harvest = biomassHarvestedFromCell(2, 0);
  expect(harvest).toStrictEqual([0, 0]);
});

test('Two harvesters collect [1,0] biomass in a cell with 1 biomass', () => {
  const harvest = biomassHarvestedFromCell(2, 1);
  expect(harvest).toStrictEqual([1, 0]);
});

test('Two harvesters collect [2,0] biomass in a cell with 2 biomass', () => {
  const harvest = biomassHarvestedFromCell(2, 2);
  expect(harvest).toStrictEqual([2, 0]);
});

test('Two harvesters collect [2,1] biomass in a cell with 3 biomass', () => {
  const harvest = biomassHarvestedFromCell(2, 3);
  expect(harvest).toStrictEqual([2, 1]);
});

test('Three harvesters collect [0,0,0] biomass in a cell with 0 biomass', () => {
  const harvest = biomassHarvestedFromCell(3, 0);
  expect(harvest).toStrictEqual([0, 0, 0]);
});

test('Three harvesters collect [1,0,0] biomass in a cell with 1 biomass', () => {
  const harvest = biomassHarvestedFromCell(3, 1);
  expect(harvest).toStrictEqual([1, 0, 0]);
});

test('Three harvesters collect [2,0,0] biomass in a cell with 2 biomass', () => {
  const harvest = biomassHarvestedFromCell(3, 2);
  expect(harvest).toStrictEqual([2, 0, 0]);
});

test('Three harvesters collect [2,1,0] biomass in a cell with 3 biomass', () => {
  const harvest = biomassHarvestedFromCell(3, 3);
  expect(harvest).toStrictEqual([2, 1, 0]);
});

test('Four harvesters collect [0,0,0,0] biomass in a cell with 0 biomass', () => {
  const harvest = biomassHarvestedFromCell(4, 0);
  expect(harvest).toStrictEqual([0, 0, 0, 0]);
});

test('Four harvesters collect [1,0,0,0] biomass in a cell with 1 biomass', () => {
  const harvest = biomassHarvestedFromCell(4, 1);
  expect(harvest).toStrictEqual([1, 0, 0, 0]);
});

test('Four harvesters collect [2,0,0,0] biomass in a cell with 2 biomass', () => {
  const harvest = biomassHarvestedFromCell(4, 2);
  expect(harvest).toStrictEqual([2, 0, 0, 0]);
});

test('Four harvesters collect [2,1,0,0] biomass in a cell with 3 biomass', () => {
  const harvest = biomassHarvestedFromCell(4, 3);
  expect(harvest).toStrictEqual([2, 1, 0, 0]);
});

test('Order of harvesters in specific cell', () => {
  sendHarvesters();
  const cell = model.cellAt(1, 3);

  expect(cell.harvesters).toHaveLength(3);

  expect(redFamily.harvesters).toContain(cell.harvesters[0]);
  expect(greenFamily.harvesters).toContain(cell.harvesters[1]);
  expect(blueFamily.harvesters).toContain(cell.harvesters[2]);
});

test('Biomass harvested in specific cell', () => {
  sendHarvesters();
  const cell = model.cellAt(1, 3);

  expect(cell.biomass).toBe(3);
  cell.step();

  const harvest = cell.harvesters.map((harvester) => harvester.harvestedBiomass);
  expect(harvest).toStrictEqual([2, 1, 0]);
});

test('Families collect correst harvest after one step', () => {
  sendHarvesters();
  model.step()

  expect(redFamily.harvestedBiomass()).toBe(7);
  expect(greenFamily.harvestedBiomass()).toBe(5);
  expect(blueFamily.harvestedBiomass()).toBe(1);
  expect(blackFamily.harvestedBiomass()).toBe(4);
  expect(pinkFamily.harvestedBiomass()).toBe(2);
});
