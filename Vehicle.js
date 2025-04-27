class Vehicle {
  constructor(options = {r: 10, color: '#2196f3', maxspeed: 4, maxforce: 0.4}) {
    this.pos = new Vector(random(WIDTH), random(HEIGHT))
    this.vel = new Vector
    this.acc = new Vector
    this.r = options.r
    this.color = options.color
    this.maxspeed = options.maxspeed
    this.maxforce = options.maxforce

    this.debug = true
  }

  applyForce(force) {
    this.acc.add(force)
  }

  update() {
    this.vel.add(this.acc)
    this.vel.limit(this.maxspeed)
    this.pos.add(this.vel)

    this.acc.mult(0)

    // this.edges()
  }

  show() {
    const {x, y} = this.pos
    const offset = this.r * 1.5
    const halfOffset = offset * 0.5

    if (this.debug) {
      let velPt = Vector.add(this.pos, this.vel.copy().mult(15))
      let hue = map(this.vel.mag, 0, this.maxspeed, 0, 100)
      ctx.beginPath()
      ctx.strokeStyle = `hsl(${hue}, 50%, 50%)`
      ctx.lineWidth = 3
      ctx.moveTo(x, y)
      ctx.lineTo(velPt.x, velPt.y)
      ctx.stroke()
    }

    ctx.translate(x, y)
    ctx.rotate(this.vel.heading)

    ctx.beginPath()
    ctx.fillStyle = this.color
    // ctx.arc(x, y, this.r, 0, TAU)
    ctx.moveTo(-offset, -halfOffset)
    ctx.lineTo(-offset, halfOffset)
    ctx.lineTo(offset, 0)
    ctx.lineTo(-offset, -halfOffset)
    ctx.fill()

    ctx.resetTransform()

  }

  edges() {
    if (this.pos.x <= 0) {
      this.pos.x = WIDTH + this.r
    } else if (this.pos.x > WIDTH) {
      this.pos.x = 0
    }
    if (this.pos.y <= 0) {
      this.pos.y = HEIGHT + this.r
    } else if (this.pos.y > WIDTH) {
      this.pos.y = 0
    }
  }

  hit(target) {
    let dist = target.dist(this.pos)
    let r = target.t ? target.r + this.r : this.r
    return dist < r
  }

  arrive(target) {
    let force = Vector.sub(target, this.pos)
    let r = 150
    let d = force.mag
    let speed = this.maxspeed

    if (d < r) {
      let m = map(d, 0, r, 0, this.maxspeed)
      speed = m
    }

    force.mag = speed
    force.sub(this.vel)
    force.limit(this.maxforce)

    if (this.debug) {
      ctx.strokeStyle = '#fafafa'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.setLineDash([15])
      ctx.arc(target.x, target.y, r, 0, TAU)
      ctx.stroke()

      ctx.setLineDash([])

    }
    return force
  }

  seek(target) {
    let force = Vector.sub(target, this.pos)
    force.mag = this.maxspeed
    force.sub(this.vel)
    force.limit(this.maxforce)
    return force
  }

  flee(target) {
    return this.seek(target).mult(-1)
  }
}