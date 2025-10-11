class Loop {
  constructor(callback, options = {}) {
    this.callback = callback;
    this.options = {
      maxDeltaTime: 100, // максимальный deltaTime в ms
      ...options
    };

    this.isRunning = false;
    this.lastTime = 0;
    this.animationId = null;
  }

  static start(callback, options = {}) {
    const loop = new Loop(callback, options);
    loop.start();
    return loop;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;

    const loop = (time) => {
      if (!this.isRunning) return;

      const dt = Math.min(time - this.lastTime, this.options.maxDeltaTime);
      this.lastTime = time;

      this.callback(dt);

      if (this.isRunning) {
        this.animationId = requestAnimationFrame(loop);
      }
    };

    requestAnimationFrame((time) => {
      this.lastTime = time;
      loop(time);
    });
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  get running() {
    return this.isRunning;
  }
}

export { Loop };
