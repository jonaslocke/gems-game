import { $$ } from "./helpers.js";

export default class Stage {
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
          this.state.update({ startGem: this.startGem, endGem: this.endGem });
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
