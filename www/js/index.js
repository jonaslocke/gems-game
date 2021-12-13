const $ = (element) => d3.select(element);
const $$ = (element) => d3.selectAll(element);
const game_el = $("#game");
const colors = {
  red: "#af002a",
  green: "#34b334",
  blue: "#00308f",
  yellow: "#cccc33",
  purple: "#431c53",
};
const columns = 6;
const gemSize = 65;

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

class Board {
  constructor({ state, game }) {
    this.startGem = null;
    this.endGem = null;
    this.neighbohrs = {};
    this.state = state;
    this.game = game;
  }
  init() {
    this.game.anchor
      .append("svg")
      .attr("viewBox", [0, 0, this.game.boardSize, this.game.boardSize])
      .attr("width", this.game.boardSize)
      .attr("height", this.game.boardSize)
      .classed("board", true);
  }
  drawGems() {
    this.game.anchor.selectAll("rect").remove();
    for (let index in this.state.data) {
      const gem = this.state.data[index];
      gem.draw(this.anchor);
    }
    $$(".gem")
      .data(this.state.data)
      .on("click", (_, gem) => {
        if (!this.startGem) {
          this.startGem = gem;
          this.selectGem();
        } else {
          const isNeighbour = Object.values(this.neighbours)
            .filter((gem) => !!gem)
            .map(({ id }) => id)
            .includes(gem.id);
          this.state.data.forEach((gem) => gem.reset());
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
            console.log("neighbour =>", going);
          } else {
            console.log("not neighbour");
            this.startGem = null;
          }
          console.log(this.state);
          // this.state.update({ startGem: this.startGem, endGem: this.endGem });
          this.startGem = null;
          this.endGem = null;
        }
      });
  }
  selectGem() {
    this.state.data.forEach((gem) => gem.reset());
    this.startGem.highlight();
    for (let neighbour in this.neighbours) {
      const gem = this.neighbours[neighbour];
      if (gem) {
        gem.neighbour();
      }
    }
  }
  get neighbours() {
    const data = this.state.data;
    const index = data.findIndex((gem) => gem.id == this.startGem.id);
    const { row } = data[index];
    return {
      left: data[index - this.game.columns] || null,
      top: row == 0 ? null : data[index - 1],
      right: data[index + this.game.columns] || null,
      bottom: row == this.game.columns - 1 ? null : data[index + 1],
    };
  }
}

class State {
  constructor({ game }) {
    this.game = game;
    this.data = this._fresh();
  }
  _fresh() {
    return new Array(this.game.columns * this.game.columns)
      .fill()
      .map((_, id) => {
        const random = Math.floor(
          Math.random() * Object.keys(this.game.colors).length
        );
        const color = Object.keys(this.game.colors)[random];
        const size = this.game.gemSize;
        const column = Math.floor(id / this.game.columns);
        const row = id % this.game.columns;
        const x = column * this.game.gemSize;
        const y = row * this.game.gemSize;
        return new Gem({
          color,
          size,
          x,
          y,
          column,
          row,
          position: id,
          game: this.game,
        });
      });
  }
  update({ startGem, endGem }) {
    const start = new Gem({ ...startGem, position: endGem.position });
    const end = new Gem({ ...endGem, position: startGem.position });
    const x = this.data.map(({ id }) => id);
  }
}

class Gem {
  constructor({ color, x, y, column, row, position, game }) {
    this.game = game;
    this.color = game.colors[color] ?? "#000000";
    this.id = `gem-${Math.random().toString(36).substring(2, 5)}-${Math.random()
      .toString(36)
      .substring(2, 7)}-${Math.random().toString(36).substring(2, 5)}`;
    this.x = x;
    this.y = y;
    this.column = column;
    this.row = row;
    this.move = {
      left: () => this._move({ x: this.x - this.game.gemSize }),
      up: () => this._move({ y: this.y - this.game.gemSize }),
      right: () => this._move({ x: this.x + this.game.gemSize }),
      down: () => this._move({ y: this.y + this.game.gemSize }),
    };
    this.position = position;
  }
  get element() {
    return $(`#${this.id}`);
  }
  draw() {
    const svg = this.game.anchor.select("svg");
    const rect = svg.append("rect");
    rect
      .attr("x", this.x)
      .attr("y", this.y)
      .attr("width", this.game.gemSize)
      .attr("height", this.game.gemSize)
      .attr("fill", this.color)
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5)
      .classed("gem", true)
      .attr("id", this.id);
  }

  _move({ x, y }) {
    this.x = x ?? this.x;
    this.y = y ?? this.y;
    this.element
      .transition()
      .attr("x", x ?? this.x)
      .attr("y", y ?? this.y);
  }
  highlight() {
    this.element.attr("stroke-width", 4).raise();
  }
  neighbour() {
    this.element
      .attr("stroke", "#f535aa")
      .attr("stroke-dasharray", "4, 5")
      .attr("stroke-width", 3);
  }
  reset() {
    this.element
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5)
      .attr("stroke-dasharray", "0,0");
  }
}

const state = new State({ game: game });
const board = new Board({
  size: columns * gemSize,
  anchor: game_el,
  state: state,
  game,
});

board.init(game);
board.drawGems(state);
