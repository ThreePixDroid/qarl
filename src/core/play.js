import { Loop } from "./Loop.js";
import { getCreator } from "./getCreator.js";

function play(config, async) {
  const creator = new getCreator(config);
  const animation = new creator(config);

  Loop.start(animation.step.bind(animation));

  return async ? animation.playPromise() : animation.play();
}

export { play };
