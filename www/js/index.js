const $ = (element) => d3.select(element);
const $$ = (element) => d3.selectAll(element);
import { game } from "./Game.js";
import Stage from "./Stage.js";
import State from "./State.js";

const state = new State({ game: game });
const stage = new Stage({
  state: state,
  game,
});

stage.init(game);
stage.drawGems(state);
