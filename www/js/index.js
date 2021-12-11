const $ = (element) => d3.select(element);
const $$ = (element) => d3.selectAll(element);
const game = $("#game");
const colors = {
  red: "#af002a",
  green: "#34b334",
  blue: "#00308f",
  yellow: "#cccc33",
  purple: "#431c53",
};

class Board {
  constructor({ size, anchor }) {
    this.size = size;
    this.anchor = anchor;
  }
  init() {
    this.anchor
      .append("svg")
      .attr("viewBox", [0, 0, this.size, this.size])
      .attr("width", this.size)
      .attr("height", this.size)
      .classed("board", true);
  }
  drawGems(gameState, gemSize) {
    this.anchor.selectAll("rect").remove();
    let data = [];
    for (let index in gameState) {
      const gem = gameState[index];
      const row = Math.floor(index / columns);
      const column = index % columns;
      const x = row * gemSize;
      const y = column * gemSize;
      gem.draw(game, { x, y });
    }
  }
}

class Gem {
  constructor({ color, size = 100 }) {
    this.color = colors[color] ?? "#000000";
    this.size = size;
  }
  draw(anchor, { x, y }) {
    const svg = anchor.select("svg");
    const rect = svg.append("rect");
    rect
      .attr("x", x)
      .attr("y", y)
      .attr("width", this.size)
      .attr("height", this.size)
      .attr("fill", this.color)
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .on("click", () => console.log(this.color));
  }
}

class State {
  constructor({ colors, columns, gemSize }) {
    this.colors = colors;
    this.columns = columns;
    this.gemSize = gemSize;
  }
  fresh() {
    return new Array(columns * columns).fill().map(() => {
      const random = Math.floor(Math.random() * Object.keys(colors).length);
      const color = Object.keys(colors)[random];
      const size = gemSize;
      return new Gem({ color, size });
    });
  }
}

const columns = 6;
const gemSize = 60;

const board = new Board({ size: columns * gemSize, anchor: game });

const gameState = new State({ colors, columns, gemSize });

board.init(game);
board.drawGems(gameState.fresh(), gemSize);

// for (let index in gameState) {
//   const gem = gameState[index];
//   const row = Math.floor(index / columns);
//   const column = index % columns;
//   const x = row * 100;
//   const y = column * 100;
//   gem.draw(board, { x, y });
// }

const x = new Gem({ color: "red" });
