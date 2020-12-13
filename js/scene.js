import Ball from "./ball.js"

const defaultProps = {
  gravity: 2,
  minBallRadius: 2,
  maxBallRadius: 2,
  numBalls: 10,
  border: true
}

export default class Scene {

  constructor (props) {
    props = {
      ...defaultProps,
      ...props
    }

    this.canvas = document.getElementById(props.canvasId)
    this.ctx = canvas.getContext('2d')
    this.border = props.border

    // set the canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    this.gravity = props.gravity
    this.createBalls(props.minBallRadius, props.maxBallRadius, props.numBalls)

    // begin update loop
    document.addEventListener('DOMContentLoaded', () => this.update())
  }

  createBalls (minRadius, maxRadius, numBalls) {
    var { canvas } = this

    this.balls = []
    for (let i = 0; i < numBalls; i++) {
      var r = minRadius + (Math.random() * (maxRadius - minRadius))
      var b = new Ball({id: i, radius: r})
      b.randomisePosition(canvas.width, canvas.height)
      this.balls.push(b)
    }
  }

  update () {
    const { ctx, canvas, gravity } = this

    // queue the next update
    window.requestAnimationFrame(() => this.update())

    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    // this.balls.forEach(b => b.draw(ctx))

    // deal with collisions
    var collisions = Ball.getCollisions(this.balls)
    collisions.forEach(c => {
      // merge the second into the first
      this.balls[this.balls.indexOf(c[0])] = c[0].merge(c[1])
      // remove the second
      var second = this.balls.find(b => b.id == c[1].id)
      var index = this.balls.indexOf(second)
      this.balls.splice(index, 1)
    })
    // update acceleration
    this.balls.forEach(b => b.updateAccel(this.balls, gravity))
    // update positions
    this.balls.forEach(b => b.update(this.border, canvas.width, canvas.height))

    // clear the canvas and redraw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    this.balls.forEach(b => this.drawBall(b))
  }

  // draw the ball
  drawBall (ball) {
    var { ctx } = this

    ctx.beginPath()
    ctx.fillStyle = ball.style
    ctx.arc(
      ball.c.x, ball.c.y,
      ball.r,
      0, Math.PI * 2
    )
    ctx.fill()
  }
}