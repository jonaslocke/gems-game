import { $ } from "./helpers.js";

class Game {
  constructor({ columns, gemSize, anchor }) {
    this.columns = columns;
    this.gemSize = gemSize;
    this.colors = {
      red: "#af002a",
      green: "#34b334",
      blue: "#00308f",
      yellow: "#cccc33",
      purple: "#431c53",
    };
    this.anchor = $(`#${anchor}`);
  }
  get stageSize() {
    return Math.pow(this.columns, 2);
  }
  get boardSize() {
    return this.columns * this.gemSize;
  }
}

const game = new Game({ columns: 5, gemSize: 100, anchor: "game" });

export { game };
