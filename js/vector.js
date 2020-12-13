export default class Vector {

  constructor (x, y) {
    this.x = x
    this.y = y
  }
  
  add (other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  scale(number) {
    return new Vector(number * this.x, number * this.y)
  }

  dot (other) {
    var v = new Vector(this.x * other.x, this.y * other.y)
    return v.x + v.y
  }

  to(other) {
    return new Vector(other.x - this.x, other.y - this.y)
  }

  size() {
    return Math.sqrt(this.dot(this))
  }
}