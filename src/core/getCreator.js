import { Curve } from "../controllers/Curve";
import { FromTo } from "../controllers/FromTo";
import { Core } from "./Core";

function getCreator(config) {
  if (!config.target) {
    return Core;

  } else if (config.creator) {

    if (!(config.creator instanceof Core)) {
      console.error("Invalid creator provided. Using default creator.");
      return Core;
    }

    return config.creator;

  } else if (config.points) {
    return Curve;

  } else if (config.from || config.to) {
    return FromTo;

  } else {
    return Core

  }
}

export { getCreator };
