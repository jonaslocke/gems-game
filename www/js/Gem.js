import { $ } from "./helpers.js";

export default class Gem {
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
