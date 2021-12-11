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
  drawGems(gameState) {
    this.anchor.selectAll("rect").remove();
    for (let index in gameState) {
      const gem = gameState[index];
      gem.draw(game);
    }
  }
}

class Gem {
  constructor({ color, size = 100, x, y }) {
    this.color = colors[color] ?? "#000000";
    this.size = size;
    this.id = `gem-${Math.random().toString(36).substring(2, 5)}-${Math.random()
      .toString(36)
      .substring(2, 7)}-${Math.random().toString(36).substring(2, 5)}`;
    this.x = x;
    this.y = y;
  }
  draw(anchor) {
    const svg = anchor.select("svg");
    const rect = svg.append("rect");
    rect
      .attr("x", this.x)
      .attr("y", this.y)
      .attr("width", this.size)
      .attr("height", this.size)
      .attr("fill", this.color)
      .attr("stroke", "#000")
      .attr("stroke-width", 1)
      .classed("gem", true)
      .attr("id", this.id)
      .on("click", () => this.move({ x: this.x + this.size }));
  }

  move({ x, y }) {
    const gem = $(`#${this.id}`);
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    gem
      .transition()
      .attr("x", x ?? this.x)
      .attr("y", y ?? this.y);
  }
}

class State {
  constructor({ colors, columns, gemSize }) {
    this.colors = colors;
    this.columns = columns;
    this.gemSize = gemSize;
  }
  fresh({ columns, gemSize }) {
    return new Array(columns * columns).fill().map((_, id) => {
      const random = Math.floor(Math.random() * Object.keys(colors).length);
      const color = Object.keys(colors)[random];
      const size = gemSize;
      const row = Math.floor(id / columns);
      const column = id % columns;
      const x = row * gemSize;
      const y = column * gemSize;
      return new Gem({ color, size, x, y });
    });
  }
}

const columns = 3;
const gemSize = 100;

const board = new Board({ size: columns * gemSize, anchor: game });

const g = new State({ colors, columns, gemSize });
const gameState = g.fresh({ columns, gemSize });

board.init(game);
board.drawGems(gameState, gemSize);
