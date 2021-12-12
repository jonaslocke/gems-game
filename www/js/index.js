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
const columns = 6;
const gemSize = 65;

class Board {
  constructor({ size, anchor, state }) {
    this.size = size;
    this.columns = Math.sqrt(state.length);
    this.anchor = anchor;
    this.startGem = null;
    this.endGem = null;
    this.neighbohrs = {};
    this.state = state;
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
    for (let index in this.state) {
      const gem = this.state[index];
      gem.draw(game);
    }
    $$(".gem")
      .data(this.state)
      .on("click", (_, data) => {
        if (!this.startGem) {
          this.startGem = data;
          this.findNeighbors(this.state);
          this.selectGem();
        } else {
          const gem = data;
          const isNeighbour = Object.values(this.neighbohrs)
            .filter((gem) => !!gem)
            .map(({ id }) => id)
            .includes(gem.id);
          this.state.forEach((gem) => gem.reset());
          if (isNeighbour) {
            this.endGem = gem;
            const horizontal = this.endGem.x - this.startGem.x;
            const vertical = this.endGem.y - this.startGem.y;
            let going =
              vertical < 0
                ? "up"
                : vertical > 0
                ? "down"
                : horizontal < 0
                ? "left"
                : "right";

            switch (going) {
              case "up":
                this.startGem.move.up();
                this.endGem.move.down();
                break;
              case "down":
                this.startGem.move.down();
                this.endGem.move.up();
                break;
              case "left":
                this.startGem.move.left();
                this.endGem.move.right();
                break;
              case "right":
                this.startGem.move.right();
                this.endGem.move.left();
                break;
            }
          } else {
            this.selectGem = null;
          }
          gameState.update({ startGem: this.startGem, endGem: this.endGem });
          this.startGem = null;
          this.endGem = null;
        }
      });
  }
  selectGem() {
    this.state.forEach((gem) => gem.reset());
    this.startGem.highlight();
    for (let neighbour in this.neighbohrs) {
      const gem = this.neighbohrs[neighbour];
      if (gem) gem.neighbour();
    }
  }
  findNeighbors() {
    const index = this.state.findIndex((gem) => gem.id == this.startGem.id);
    const { row, column } = this.state[index];
    this.neighbohrs = {
      left: this.state[index - this.columns] || null,
      top: row == 0 ? null : this.state[index - 1],
      right: this.state[index + this.columns] || null,
      bottom: row == this.columns - 1 ? null : this.state[index + 1],
    };
  }
}

class Gem {
  constructor({ color, size = 100, x, y, column, row, position }) {
    this.color = colors[color] ?? "#000000";
    this.size = size;
    this.id = `gem-${Math.random().toString(36).substring(2, 5)}-${Math.random()
      .toString(36)
      .substring(2, 7)}-${Math.random().toString(36).substring(2, 5)}`;
    this.x = x;
    this.y = y;
    this.column = column;
    this.row = row;
    this.move = {
      left: () => this._move({ x: this.x - this.size }),
      up: () => this._move({ y: this.y - this.size }),
      right: () => this._move({ x: this.x + this.size }),
      down: () => this._move({ y: this.y + this.size }),
    };
    this.position = position;
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
      .attr("stroke-width", 0.5)
      .classed("gem", true)
      .attr("id", this.id);
  }

  _move({ x, y }) {
    const gem = $(`#${this.id}`);
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    gem
      .transition()
      .attr("x", x ?? this.x)
      .attr("y", y ?? this.y);
  }
  highlight() {
    const gem = $(`#${this.id}`);
    gem.attr("stroke-width", 4).raise();
  }
  neighbour() {
    const gem = $(`#${this.id}`);
    gem
      .attr("stroke", "#f535aa")
      .attr("stroke-dasharray", "4, 5")
      .attr("stroke-width", 3);
  }
  reset() {
    const gem = $(`#${this.id}`);
    gem
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "0,0");
  }
}

class State {
  constructor({ colors, columns, gemSize }) {
    this.colors = colors;
    this.columns = columns;
    this.gemSize = gemSize;
    this.data = this._fresh();
  }
  _fresh() {
    return new Array(this.columns * this.columns).fill().map((_, id) => {
      const random = Math.floor(
        Math.random() * Object.keys(this.colors).length
      );
      const color = Object.keys(this.colors)[random];
      const size = gemSize;
      const column = Math.floor(id / this.columns);
      const row = id % this.columns;
      const x = column * gemSize;
      const y = row * gemSize;
      return new Gem({ color, size, x, y, column, row, position: id });
    });
  }
  update({ startGem, endGem }) {
    const start = new Gem({ ...startGem, position: endGem.position });
    const end = new Gem({ ...endGem, position: startGem.position });
    const x = this.data.map(({ id }) => id);
    console.log(x);
  }
}

const state = new State({ colors, columns, gemSize });
const board = new Board({
  size: columns * gemSize,
  anchor: game,
  state: state.data,
});

board.init(game);
board.drawGems(state);
