export default class Colour {

    constructor(r, g, b) {
        this.r = r
        this.g = g
        this.b = b
    }

    merge(other) {
        return new Colour(
            (this.r + other.r) / 2,
            (this.g + other.g) / 2,
            (this.b + other.b) / 2,
        )
    }
}