import Scene from "./scene.js"

new Scene({
  canvasId: "canvas",
  minBallRadius: 1,
  maxBallRadius: 1.5,
  numBalls: 1000,
  gravity: 0.5,
  border: false
})