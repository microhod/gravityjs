import Colour from "./colour.js"
import Vector from "./vector.js"

const defaultProps = {
  x: 0,
  y: 0,
  radius: 5,
  colour: new Colour(255, 0, 0)
}

export default class Ball {

  constructor(props) {
    props = {
      ...defaultProps,
      ...props,
    }

    this.id = props.id

    this.colour = props.colour
    this.r = props.radius
    this.m = Math.PI * (this.r ** 2)

    this.c = new Vector(props.x, props.y) // center
    this.v = new Vector(0, 0)             // velocity
    this.a = new Vector(0, 0)             // acceleration
  }

  randomisePosition(maxX, maxY) {
    this.c = new Vector(Math.random() * maxX, Math.random() * maxY)
  }

  // update the velocity and position of the ball based on current acceleration
  update(boundary = true, width = Infinity, height = Infinity) {
    var { c, v } = this

    if (boundary) {
      this.clip(width, height)
    }

    this.v = v.add(this.a)
    this.c = c.add(this.v)
  }

  // clip the position of the ball into the limits provided
  clip(width, height) {
    var { c, v, r } = this

    if (c.x - r < 0) { // left
      this.c.x = r
      this.v.x = -1 * v.x
    }
    if (c.x + r > width) { // right
      this.c.x = width - r
      this.v.x = -1 * v.x
    }
    if (c.y + -r < 0) { // top
      this.c.y = r
      this.v.y = -1 * v.y
    }
    if (c.y + r > height) { // bottom
      this.c.y = height - r
      this.v.y = -1 * v.y
    }
  }

  // update accelleration based on the positions and masses of the other balls
  updateAccel(balls, gravity) {
    // reset acceleration each time
    this.a = new Vector(0, 0)
    balls.forEach(b => {
      var acc = this.accelFrom(b, gravity)
      this.a = this.a.add(acc)
    })
  }

  // compute acceleration from another ball using a = GM/(r^2)
  accelFrom(other, gravity) {
    var d = this.c.to(other.c)
    var dotD = d.dot(d)
    if (dotD != 0) {
      // first scale is to get a unit vector, next is for the pull of gravity
      return d.scale(1 / Math.sqrt(dotD)).scale((gravity * other.m) / (dotD))
    } else {
      return new Vector(0, 0)
    }
  }

  // has this ball hit the other ball
  hit(other) {
    return this.c.to(other.c).size() < this.r + other.r
  }

  // merge another ball into this one preserving momentum and combining mass
  merge(other) {
    var biggest = this.m > other.m ? this : other
    var merged = new Ball({
      id: this.id,
      // smaller ball is 'sucked into' larger one - i.e. the larger one doesn't move on merge
      x: biggest.c.x,
      y: biggest.c.y,
      colour: this.colour.merge(other.colour),
      // compute radius to ensure merged_mass = this_mass + other_mass
      radius: Math.sqrt(this.r ** 2 + other.r ** 2),
    })
    // conservation of momentum: 
    // merged_mass * merged_velocity = this_mass * this_velocity + other_mass * other_velocity
    var momentum = this.v.scale(this.m).add(other.v.scale(other.m))
    merged.v = momentum.scale(1 / merged.m)
    return merged
  }

  // get all unique collisions in the form [a, b] where a and b are balls which have collided
  static getCollisions(balls) {
    var c = []
    balls.forEach((a, i) => {
      // slice ensures we only count collisions once: we only check balls 'ahead' of us in the list
      balls.slice(i)
        .filter(b => b.id != a.id)
        .filter(b => a.hit(b))
        .forEach(b => c.push([a, b]))
    })
    return c
  }
}