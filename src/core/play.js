import { Curve } from "../controllers/Curve";
import { FromTo } from "../controllers/FromTo";
import { Core } from "./Core";
import loop from "./loop";

function play(config, async) {
    const creator = new getCreator(config);
    const animation = new creator(config);
    loop(animation);
    return async ? animation.playPromise() : animation.play();
}

function getCreator(config) {
  if (!config.target) {
    return Core;

  } else if (config.creator) {
    return config.creator;

  } else if (config.points) {
    return Curve;

  } else if (config.from || config.to) {
    return FromTo;

  } else {
    return Core

  }
}

export { play, getCreator };