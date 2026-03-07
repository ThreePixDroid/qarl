import { Loop } from "./Loop.js";
import { getCreator } from "./getCreator.js";

function play(config, async) {
  const Creator = getCreator(config);
  const animation = new Creator(config);

  Loop.start(animation.step.bind(animation));

  return async ? animation.playPromise() : animation.play();
}

export { play };
