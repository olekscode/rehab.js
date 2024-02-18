# rehab-game

ReHab serious game implemented in JavaScript and released as [npm package](https://www.npmjs.com/package/rehab-game).

## Installation

Run the following instruction in your terminal to install `rehab-game` into your project.
```
npm i rehab-game
```

## Usage

```js
import { ReHabModel } from 'rehab-game';

const model = new ReHabModel();
```
```js
model.cells.map((cell) => cell.biomass);
```
```js
const family = model.families[0];
const harvester = family.harvesters[0];
const cell = model.cellAt(0, 2);

harvester.goToCell(cell);
```
```js
model.step();
```
```js
cell.numberOfBirds;
harvester.harvestedBiomass;
family.harvestedBiomass();
```
```js
model.bringAllHarvestersHome();
```
