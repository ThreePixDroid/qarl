# QARL

QARL is a high-performance animation library for real-time scenes, game loops, and interactive 3D apps.

Built for developers who want smooth motion without heavyweight setup, QARL gives you a clean API for from/to tweens, curve-driven movement, custom controllers, and manager-based orchestration.

> Early release: the core API is already useful, while some edge cases and advanced workflows are still being refined. If you are evaluating QARL for production, pin a version and test it against your own runtime requirements.

## Why QARL?

QARL is built for real-time work, not flashy demos. It focuses on the things that matter in actual game code: predictable updates, flexible control, and performance that keeps up with the frame loop.

- Fast enough for per-frame updates.
- Designed to keep runtime allocations low in common playback paths.
- Flexible API: use simple `play()` calls or build custom animation classes.
- Friendly to engine-style architecture with manual stepping, managers, loops, and events.
- Low mental overhead for common animation tasks.

## Installation

Install from npm:

```bash
npm install qarl
```

Examples below use a namespace import:

```js
import * as QARL from 'qarl';
```

Named imports work too, for example: `import { Core, FromTo, Curve, Manager, GlobalManager, play, Loop, easings, modes, EVENTS, DEFAULTS } from 'qarl'`.

## FromTo example

```js
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x00ffff })
)

const fromToAnim = new QARL.FromTo({
    target: cube3,
    dynamic: true, // default false - to bake from and to
    loop: true,
    time: 3000,
    mode: QARL.modes.pingPong, // bounce, yoyo, pingPong
    easing: QARL.easings.outQuad,
    from: { rotation: { x: 1, y: 2 }, position: { x: 2, z: 2 }, scale: { x: .01, y: 1, z: 1 } },
    to: { rotation: { x: 3, y: -5 }, position: { x: -2, z: -2 }, scale: { x: 3, y: .5, z: .5 } },
})

// fromToAnim.play()

// fromToAnim.step(dt)
```

## Curve example

```js
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
)

//  default mode

const curveAnim = new QARL.Curve({
    target: cube3,
    loop: true,
    time: 10000,
    mode: QARL.modes.yoyo,
    easing: QARL.easings.inOutBack,
    smoothing: 10,
    // position.x
    points: [
        [-2],
        [ 2],
        [ 2],
        [-2],
        [-2],
        [ 2],
    ],

    // or position.x and position.y
    // points: [
    //     [-2, -2],
    //     [ 2, -2],
    //     [ 2,  0],
    //     [-2,  0],
    //     [-2,  2],
    //     [ 2,  2],
    // ],

    // or position.x, position.y and position.z
    // points: [
    //     [-2, -2,  0,],
    //     [ 2, -2,  0,],
    //     [ 2,  0,  1,],
    //     [-2,  0,  1,],
    //     [-2,  2,  0,],
    //     [ 2,  2,  0,],
    // ],
})

// or custom properties

const curveAnimCustom = new QARL.Curve({
    target: cube3,
    loop: true,
    time: 10000,
    mode: QARL.modes.yoyo,
    easing: QARL.easings.inOutBack,
    smoothing: 10,
    properties: ['position.z', 'scale.y', 'scale.z', 'position.x'], // custom properties order
    points: [
        [0, .5, .5, -2,],
        [0, .2, .2,  2,],
        [1, .5, .5,  2,],
        [1, .2, .2, -2,],
        [0, .5, .5, -2,],
        [0, .2, .2,  2,],
    ],
})

// curveAnim.play() or curveAnimCustom.play()

// curveAnim.step(dt) or curveAnimCustom.step(dt)
```


## Manager example

```js
const qarlManager = new QARL.Manager()

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
)

const qarl1 = qarlManager.create({
    target: cube3,
    loop: true,
    time: 10000,
    mode: QARL.modes.yoyo,
    easing: QARL.easings.inOutBack,
    smoothing: 10,
    // properties: ['position.x', 'position.y', 'position.z'], // default properties
    points: [
        [-2, -2, 0],
        [ 2, -2, 0],
        [ 2,  0, 1],
        [-2,  0, 1],
        [-2,  2, 0],
        [ 2,  2, 0],
    ],
})

// or

const cube3clone = cube3.clone()

const qarl2 = qarlManager.create({
    target: cube3clone,
    loop: true,
    time: 3000,
    mode: QARL.modes.pingPong, // bounce, yoyo, pingPong
    easing: QARL.easings.outQuad,
    from: { rotation: { x: 1, y: 2 }, position: { x: 2, z: 2 }, scale: { x: .01, y: 1, z: 1 } },
    to: { rotation: { x: 3, y: -5 }, position: { x: -2, z: -2 }, scale: { x: 3, y: .5, z: .5 } },
})

// qarlManager.update(dt)
```

## Quick `play()` example


```js
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff00ff })
)

QARL.play({
    target: cube3,
    loop: true,
    time: 10000,
    mode: QARL.modes.yoyo,
    easing: QARL.easings.inOutBack,
    smoothing: 10,
    // properties: ['position.x', 'position.y', 'position.z'], // default properties
    points: [
        [-2, -2, 0],
        [ 2, -2, 0],
        [ 2,  0, 1],
        [-2,  0, 1],
        [-2,  2, 0],
        [ 2,  2, 0],
    ],
})

// or

const cube3clone = cube3.clone()

QARL.play({
    target: cube3clone,
    loop: true,
    time: 3000,
    mode: QARL.modes.bounce,
    easing: QARL.easings.inOutSine,
    from: { rotation: { x: 1, y: 2 }, position: { x: 2, z: 2 }, scale: { x: .01, y: 1, z: 1 } },
    to: { rotation: { x: 3, y: -5 }, position: { x: -2, z: -2 }, scale: { x: 3, y: .5, z: .5 } },
})

// async

await QARL.play({ /*... config ...*/ }, true) // true for async

```

## GlobalManager and Loop example

```js
import { GlobalManager, Loop } from 'qarl';

const cube = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0xff6b6b })
);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.7),
  new THREE.MeshBasicMaterial({ color: 0x4ecdc4 })
);

const cubeAnimation = GlobalManager.create({
    target: cube,
    time: 2000,
    from: { rotation: { x: 0, y: 0, z: 0 } },
    to: { rotation: { x: Math.PI * 2, y: Math.PI * 2, z: Math.PI * 2 } },
    easing: 'outElastic',
    loop: true,
    mode: 'pingPong'
});

const sphereAnimation = GlobalManager.create({
    target: sphere,
    time: 3000,
    properties: ['position.x', 'position.y', 'position.z', 'scale.x', 'scale.y', 'scale.z'],
    points: [
        [0, 0, 0, 1, 1, 1],
        [1, 2, 0, 2, .5, 2],
        [-1, 2, 0, 1, 2, 1],
        [0, 0, 0, 1, 1, 1]
    ],
    smoothing: 20,
    easing: 'outBack',
    loop: true,
});

cubeAnimation.play();
sphereAnimation.play();

const gameLoop = Loop.start(GlobalManager.update);

// gameLoop.stop();
```

## Advanced usage

Everything below is optional. If `FromTo`, `Curve`, `Manager`, and `play()` already cover your workflow, you can stop there. The rest is for custom controllers, event maps, processors, and lower-level control.

### Which class runs? (`Manager.create` / `play`)

These are the runtime selection rules used by `getCreator`:

- No truthy **`target`** → always **`Core`** (even if you pass `from` / `to` / `points`).
- **`creator: YourClass`** → `YourClass` (must `extend Core`; checked at runtime).
- Otherwise, with **`target`**: **`points`** → **`Curve`**; **`from` or `to`** → **`FromTo`**; else **`Core`**.

### Core-only (timing / events, no built-in tween)

Use this when you want QARL's timing, easing, delays, and events without the built-in tween behavior. Override `_applyValues()` in a subclass or listen to `UPDATE`. Extra config fields are merged into **`this.settings`** (here `pulseAmount`), so you can change them later with **`anim.tweak({ pulseAmount: … })`** even while the animation is running.

```js
// const mesh = new THREE.Mesh(...)

class Pulse extends QARL.Core {
  _applyValues() {
    const amount = this.settings.pulseAmount ?? 0.15
    const s = 1 + amount * this.easeValue
    this.target.scale.setScalar(s)
  }
}

const anim = new Pulse({
  target: mesh,
  time: 800,
  easing: QARL.easings.outQuad,
  loop: true,
  pulseAmount: 0.25,
})

anim.onUpdate((a) => {
  /* a.progress, a.easeValue */
})

// anim.play()
// anim.tweak({ pulseAmount: 0.4 }) // e.g. later or while playing
// anim.step(dt)
```

### Custom controller (`creator`)

Same idea, but with your own class passed through `creator`. Extra options live on **`this.settings`** and stay adjustable through **`tweak`**.

```js
// const mesh = new THREE.Mesh(...)

class Wobble extends QARL.Core {
  _applyValues() {
    const amp = this.settings.wobbleAmplitude ?? 0.2
    this.target.rotation.z = Math.sin(this.easeValue * Math.PI * 2) * amp
  }
}

const m = new QARL.Manager()
const w = m.create({
  creator: Wobble,
  target: mesh,
  time: 1200,
  easing: QARL.easings.inOutSine,
  loop: true,
  wobbleAmplitude: 0.35,
})
// m.update(dt)
// w.tweak({ wobbleAmplitude: 0.12 })
```

### Events: `on` / `once` in `create`, and `EVENTS`

`Manager.create` / `GlobalManager.create` accept **`on`** (persistent) and **`once`** (one-shot) maps keyed by event name.

```js
// const mesh = new THREE.Mesh(...)

const anim = new QARL.Manager().create({
  target: mesh,
  to: { position: { x: 5 } },
  time: 600,
  on: {
    update: (a) => {
      /* a.progress */
    },
  },
  once: {
    complete: () => console.log('done'),
  },
})
```

String constants live on **`QARL.EVENTS`** (e.g. `QARL.EVENTS.UPDATE`, `QARL.EVENTS.COMPLETE`). Same names as in `.on('update', …)`.

### FromTo: `from()` / `to()` / `swap()`

On an active `FromTo`, you can change endpoints and flip direction. Internally, QARL rebuilds the lerps through `tweak()`:

```js
fromToAnim.from({ x: 0 }).to({ x: 100 }).play()
fromToAnim.swap().replay(false)
```

### Processors and `DEFAULTS`

**`processors`** are optional middleware hooks that run before refreshed state is applied. Use them to adjust `settings` on the fly: randomize `delay`, clamp `time`, inject difficulty, or recompute `from` / `to` from the current `target` state.

**Mechanics:** `applyProcessors` calls **`processor.call(animation, settings)`**, then merges the returned partial object with **`Core.mergeConfigs(settings, returnValue || {})`**. A processor can **return a partial config**, **mutate `settings` in place**, or do both.

**When it runs:** inside **`_refreshDynamicProps()`** — on **`reset()`**, **`tweak()`**, and before **`play()`** when **`autoApplyProcessors: true`**. With **`false`**, processors still run on construct / **`reset()`** / **`tweak()`**, but not on every **`play()`**. Call **`anim.applyProcessors()`** manually when you need that behavior.

**`QARL.DEFAULTS`** is the shared base config. Class-specific defaults are also exposed as **`QARL.Core.DEFAULTS`**, **`QARL.FromTo.DEFAULTS`**, and **`QARL.Curve.DEFAULTS`**.

Example — one `FromTo` attached to one mesh: with **`autoApplyProcessors: true`**, each **`play()`** recalculates **`to`** from the object's current state, so repeated plays keep pushing the same delta forward. If you omit **`from`**, `FromTo` derives the start pose from the target using the shape of **`to`**.

```js
const slideX = new QARL.FromTo({
  target: unitA,
  time: 500,
  easing: QARL.easings.outQuad,
  autoApplyProcessors: true,
  processors: [
    function (s) {
      return {
        to: { position: { x: s.target.position.x + 3 } },
      }
    },
  ],
})

slideX.play() // e.g. mesh at x = 0 → animates 0 → 3
slideX.play() // mesh now at x = 3 → animates 3 → 6
```

### Tweaking timeline and playback

```js
anim.tweak({ time: 2000, easing: 'outCubic' })
anim.seek(500)
anim.setProgress(0.5)
await anim.playPromise()
anim.pause()
anim.play()
anim.replay(false)
```

### TypeScript

QARL ships with typings (`"types": "./types/index.d.ts"`). Use named or namespace imports as usual; types such as `FromToSettings`, `ManagerCreateConfig`, `AnimationConstructor`, and `CoreAnimation` are exported from `'qarl'`.

```ts
import type { FromToSettings, ManagerCreateConfig } from 'qarl'
```
