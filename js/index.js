import Scene from "./scene.js"

var gravity = document.getElementById("input-gravity")
var numBalls = document.getElementById("input-num-balls")
var border = document.getElementById("input-border")
var initSpeed = document.getElementById("input-init-speed")
var initSize = document.getElementById("input-init-size")

var button = document.getElementById("button-new")

// max size, once balls gets high enough, they all dissapear
// if lots are off screen, border clipping doesn't work, they all dissapear again

var minBallRadius = 1

var scene = new Scene({
  canvasId: "canvas",
  minBallRadius: minBallRadius,
  maxBallRadius: initSize.value,
  numBalls: numBalls.value,
  gravity: gravity.value,
  border: border.checked
})

var updateScene = () => {
  // increase gravity exponentially along the slider
  scene.gravity = gravity.value == -5 ? 0 : 2 ** gravity.value
  scene.border = border.checked
}

// reload when sliders have loaded
window.addEventListener('load', updateScene)

// update on slider changes
gravity.addEventListener("change", updateScene)
border.addEventListener("change", updateScene)

// create new balls on button click
button.addEventListener("click", () => {
  scene.createBalls(minBallRadius, initSize.value, numBalls.value, initSpeed.value)
  updateScene()
})