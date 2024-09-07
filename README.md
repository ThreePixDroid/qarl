# QARL (Quantum Animation Remixable Library) 😎

*Description generated by GPT while we were busy doing more important things.*

QARL is an animation library for my game engine.

⚠️ **Attention!** ⚠️

New project! 💡 It surely has some bugs, unfinished features, and odd solutions, but I've put a lot of heart and effort into it. Thanks for stopping by—I hope you'll enjoy it! 🙏✨

## Why QARL? 🏎️💨

Looking for performance? QARL's FromTo animation computes so fast, it feels like it bends space-time! 💫 No more waiting for slow calculations—just smooth, seamless transitions that keep up with the pace of your game.

## Installation

Install the library via npm:

```bash
npm install qarl
```

## FromTo example

```js
new QARL.FromTo({
    target: cube3,
    dynamic: true,
    loop: true,
    time: 3000,
    mode: QARL.modes.pingPong,
    easing: QARL.easings.outQuad,
    from: { rotation: { x: 1, y: 2 }, position: { x: 2, z: 2 }, scale: { x: .01, y: 1, z: 1 } },
    to: { rotation: { x: 3, y: -5 }, position: { x: -2, z: -2 }, scale: { x: 3, y: .5, z: .5 } },
})
```
