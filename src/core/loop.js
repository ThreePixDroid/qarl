import { EVENTS } from "./events";

function loop(animation) {
    let lastTime = 0;
    let complete = false;

    animation.once(EVENTS.COMPLETE, () => {
      complete = true;
    });

    const loop = (time) => {
      const dt = (time - lastTime)
      lastTime = time;
      animation.step(dt);
      !complete && requestAnimationFrame(loop);
    };

    requestAnimationFrame((time) => {
      lastTime = time;
      loop(time);
    });
  }

export default loop;
