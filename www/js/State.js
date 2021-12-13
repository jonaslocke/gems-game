import Gem from "./Gem.js";
export default class State {
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
    console.log(startGem, endGem);
    // const start = new Gem({ ...startGem, position: endGem.position });
    // const end = new Gem({ ...endGem, position: startGem.position });
    // const x = this.data.map(({ id }) => id);
  }
}
