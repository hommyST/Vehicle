class Vector {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  get heading() {
    return Math.atan2(this.y, this.x)
  }

  get mag() {
    return Math.sqrt(this.magSq)
  }

  get magSq() {
    const x = this.x
    const y = this.y
    return x * x + y * y
  }

  set mag(n) {
    this.normalize()
    this.mult(n)
  }

  mult(...args) {
    let [x, y] = args
    if (args.length === 1) {
      this.x *= x
      this.y *= x
    } else if (args.length === 2) {
      this.x *= x
      this.y *= y
    }
    return this
  }

  div(...args) {
    let [x, y] = args
    if (args.length === 1) {
      this.x /= x
      this.y /= x
    } else if (args.length === 2) {
      this.x /= x
      this.y /= y
    }
    return this
  }

  add(...args) {
    let [x, y] = args
    if (x instanceof Vector) {
      this.x += x.x
      this.y += x.y
    } else if (args.length === 1) {
      this.x += x
      this.y += x
    } else if (args.length === 2) {
      this.x += x
      this.y += y
    }
    return this
  }

  sub(...args) {
    let [x, y] = args
    if (x instanceof Vector) {
      this.x -= x.x
      this.y -= x.y
    } else if (args.length === 1) {
      this.x -= x
      this.y -= x
    } else if (args.length === 2) {
      this.x -= x
      this.y -= y
    }
    return this
  }

  copy() {
    return new Vector(this.x, this.y)
  }

  normalize() {
    const len = this.mag
    
    if (len !== 0) this.mult(1 / len)
    return this
  }

  limit(max) {
    const mSq = this.magSq
    if (mSq > max * max) {
      this.normalize()
      this.mag = max
    }
    return this
  }

  rotate(angle) {
    const newHeading = this.heading + angle
    const mag = this.mag
    this.x = Math.cos(newHeading) * mag
    this.y = Math.sin(newHeading) * mag
    return this
  }

  dist(v) {
    const newV = v.copy()
    newV.sub(this)
    return newV.mag
  }

  dot(x, y) {
    if (x instanceof Vector) {
      return this.dot(x.x, x.y)
    }
    return this.x * x + this.y * y
  }

  print() {
    console.log(
      `%cX%c = ${this.x}; %cY%c = ${this.y}; %cMag%c = ${this.mag}`,

      'color: #2196f3;',
      'color: #bdbdbd',
      'color: #2196f3;',
      'color: #bdbdbd',
      'color: #2196f3;',
      'color: #bdbdbd',
    )
  }




  /* STATIC staff */
  static toDegree(angle) {
    return angle * 180 / Math.PI
  }
  static toRadians(angle) {
    return Math.PI / 180 * angle 
  }

  static fromAngle(angle) {
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  static add(...args) {
    let [v1, v2] = args
    if (!(v1 instanceof Vector)) return null

    const newV = v1.copy()
    newV.add(v2)

    return newV
  }

  static sub(...args) {
    let [v1, v2] = args
    if (!(v1 instanceof Vector)) return null

    const newV = v1.copy()
    newV.sub(v2)

    return newV
  }

  static mult(...args) {
    const [v1, n] = args
    if (!(v1 instanceof Vector) || !(typeof n === 'number')) return null

    const newV = v1.copy()
    newV.mult(n)

    return newV
  }

  static div(...args) {
    const [v1, n] = args
    if (!(v1 instanceof Vector) || !(typeof n === 'number')) return null

    const newV = v1.copy()
    newV.div(n)

    return newV
  }

  static dist(...args) {
    const [v1, v2] = args
    if (!(v1 instanceof Vector) || !(v2 instanceof Vector)) return null

    return v1.dist(v2)
  }

  static randomUnit() {
    return this.fromAngle(Math.random() * (Math.PI * 2));
  }
}
