import { radians } from "./math.js";
import Vector from "./Vector.js";

export default class Canvas {
  constructor(canvasEl) {
    this.canvas = canvasEl
    this.ctx = canvasEl.getContext('2d')
  }

  get width() {
    return this.canvas.width
  }
  set width(n) {
    this.canvas.width = n
  }

  get height() {
    return this.canvas.height
  }
  set height(n) {
    this.canvas.height = n
  }

  fill(color) {
    this.ctx.fillStyle = color
  }
  stroke(color) {
    this.ctx.strokeStyle = color
  }
  strokeWeight(w) {
    this.ctx.lineWidth = w
  }

  circle(x, y, r = 3) {
    let _x, _y, _r
    if (x instanceof Vector) {
      if (typeof y === 'number') _r = y
      else _r = r

      _x = x.x
      _y = x.y
    } else {
      _x = x
      _y = y
      _r = r
    }

    this.ctx.beginPath()
    this.ctx.ellipse(_x, _y, _r * 2, _r * 2, 0, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.closePath()
  }

  line(x1, y1, x2, y2) {
    let _x1, _y1, _x2, _y2

    if (x1 instanceof Vector && y1 instanceof Vector) {
      _x1 = x1.x
      _y1 = x1.y
      _x2 = y1.x
      _y2 = y1.y
    } else {
      _x1 = x1
      _y1 = y1
      _x2 = x2
      _y2 = y2
    }

    this.ctx.beginPath()
    this.ctx.moveTo(_x1, _y1)
    this.ctx.lineTo(_x2, _y2)
    this.ctx.stroke()
  }

  triangle(a, b, c) {
    this.ctx.beginPath()
    this.ctx.moveTo(a.x, a.y)
    this.ctx.lineTo(b.x, b.y)
    this.ctx.lineTo(c.x, c.y)
    this.ctx.lineTo(a.x, a.y)
    this.ctx.fill()
    this.ctx.closePath()
  }

  vector(x1, y1, x2, y2, arrowColor = '#1976D2') {
    let end
    let _x1, _y1, _x2, _y2

    if (x1 instanceof Vector && !x2 && !y2 && !y1 || typeof y1 === 'string') {
      if (x1 instanceof Vector) {
        if (typeof y1 === 'string') {
          arrowColor = y1
        }
        _x1 = 0
        _y1 = 0
        _x2 = x1.x
        _y2 = x1.y
      }
    } else if (x1 instanceof Vector && y1 instanceof Vector) {
      if (typeof x2 === 'string') {
        arrowColor = x2
      }
      _x1 = x1.x
      _y1 = x1.y
      _x2 = y1.x
      _y2 = y1.y
    } else if (!y2 && typeof x1 === 'number' && typeof y1 === 'number' ) {
      if (typeof x2 === 'string') {
        arrowColor = x2
      }
      _x1 = 0
      _y1 = 0
      _x2 = x1
      _y2 = y1
    } else {
      _x1 = x1
      _y1 = y1
      _x2 = x2
      _y2 = y2
    }

    end = new Vector(_x2, _y2)
    let lineEnd = new Vector(_x2, _y2)
    lineEnd.mult(0.999)
    this.ctx.save()

    this.ctx.translate(_x1, _y1)
    this.ctx.beginPath()
    this.ctx.moveTo(0, 0)
    this.ctx.lineTo(lineEnd.x, lineEnd.y)
    this.ctx.stroke()
    
    this.ctx.beginPath()
    this.ctx.translate(end.x, end.y)
    this.ctx.rotate(Math.PI / 2 + end.heading)
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = arrowColor
    this.ctx.fillStyle = arrowColor
    this.ctx.moveTo(-5, 15)
    this.ctx.lineTo(5, 15)
    this.ctx.lineTo(0, 0)
    this.ctx.fill()
    this.ctx.closePath()

    this.ctx.restore()
  }


  resetTransform() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}