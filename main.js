const ctrl = {
  closeControl: document.querySelector('#closeControl'),
  mspeedInput: document.querySelector('#maxspeed input'),
  mspeedOut: document.querySelector('#maxspeed output'),
  mforceInput: document.querySelector('#maxforce input'),
  mforceOut: document.querySelector('#maxforce output'),

  get mspeed() {
    return Number(ctrl.mspeedInput.value) || 0
  },
  get mforce() {
    return Number(ctrl.mforceInput.value) || 0
  },

  init() {
    ctrl.mspeedOut.textContent = ctrl.mspeedInput.value.padStart(2, '0')
    ctrl.mforceOut.textContent = (+ctrl.mforceInput.value).toFixed(2)

    ctrl.closeControl.addEventListener('click', () => {
      document.querySelector('.controls').classList.toggle('closed')
    })

    ctrl.mspeedInput.addEventListener('input', ({target}) => {
      ctrl.mspeedOut.textContent = target.value.padStart(2, '0')
    })
    ctrl.mforceInput.addEventListener('input', ({target}) => {
      ctrl.mforceOut.textContent = (+target.value).toFixed(2)
    })
  }
}
ctrl.init()

/** @type {HTMLCanvasElement} */
const cnv = document.querySelector('canvas')
const ctx = cnv.getContext('2d')


const WIDTH = 800
const HEIGHT = 500

const PI = Math.PI
const TAU = PI * 2


let mouseX = 0
let mouseY = 0
let isMousePressed = false

const vPoints = []
const endPoints = []
let drawing = false

let ball = new Vehicle
let target = new Vector(random(100, WIDTH - 100), random(100, HEIGHT - 100))
target.r = random(7, 15)

window.addEventListener('mousemove', ({x, y}) => {
  mouseX = x
  mouseY = y
})
window.addEventListener('mousedown', () => {isMousePressed = true})
window.addEventListener('mouseup', () => {isMousePressed = false})

cnv.addEventListener('click', () => {
  // vPoints.push(new Vector(mouseX, mouseY))
  // point(mouseX, mouseY)

  // if (vPoints.length === 2) {
  //   const zeroV = new Vector(0, 0)
  //   let v1 = vPoints[0]
  //   let v2 = vPoints[1]
  //   const newV1 = Vector.add(v1, v2)

  //   const subV = Vector.sub(v1, v2)
  //   subV.mag = 30
  //   const pointingToV2 = Vector.add(v2, subV)

  //   // console.log(v1, v2, newV1)

  //   line(zeroV, newV1, '#009688')
  //   line(zeroV, subV, '#f44336')

  //   line(v2, pointingToV2, '#b71c1c')

  //   let mx = v1.x / v2.x
  //   let my = v1.y / v2.y
  //   let mV = new Vector(mx, my)
  //   const newV3 = Vector.add(v1, mV)

  //   line(v1, newV3, '#ff9800')

  // } else if (vPoints.length > 2) {
  //   vPoints.length = 0
  //   background()
  // }
  
})

let v1Pos = new Vector(WIDTH / 2, HEIGHT / 2)
let v1 = Vector.randomUnit().mult(random(100, 300))

void function setup() {
  cnv.width = WIDTH
  cnv.height = HEIGHT

  background()

  requestAnimationFrame(draw)
}()

function draw() {
  const zeroV = new Vector(0, 0)
  const mv = new Vector(mouseX, mouseY)
  background()

  ctx.beginPath()
  ctx.fillStyle = '#f44336aa'
  ctx.arc(target.x, target.y, target.r, 0, TAU)
  ctx.fill()

  ctx.font = '16px monospace'
  ctx.textBaseline = 'top'
  ctx.fillText(`target: {x: ${Math.floor(target.x)}, y: ${Math.floor(target.y)}}`, 10, 10)
  ctx.fillStyle = '#ff9800'
  ctx.fillText(`dist: ${Vector.sub(target, ball.pos).mag.toFixed(1)}`, 10, 30)

  ball.maxspeed = ctrl.mspeed
  ball.maxforce = ctrl.mforce

  target = mv.copy()
  target.r = 20
  
  const force = ball.arrive(target)
  ball.applyForce(force)
  ball.update()
  ball.show()

  // if (ball.hit(target)) {
  //   target = new Vector(random(100, WIDTH - 100), random(100, HEIGHT - 100))
  //   target.r = random(7, 15)
  // }
  

  requestAnimationFrame(draw)
}


function background() {
  ctx.save()
  ctx.resetTransform()
  ctx.fillStyle = '#212121'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)
  ctx.restore()
}

function point(x, y, color = '#fafafa') {
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x, y, 4, 0, TAU)
  ctx.fill()
}

function line(a, b, color = '#fafafa') {
  ctx.lineWidth = 2
  ctx.strokeStyle = color
  ctx.beginPath()
  ctx.moveTo(a.x, a.y)
  ctx.lineTo(b.x, b.y)
  ctx.stroke()
}




function pointingToMouse() {
  const startV = new Vector(250, 300)
  const mV = new Vector(mouseX, mouseY)

  let fromPointV = Vector.sub(mV, startV)
  // let fromPointV = Vector.sub(startV, mV)
  // line(zeroV, fromPointV, '')
  fromPointV.limit(100)
  // fromPointV.mag = 50
  let endV = Vector.add(startV, fromPointV)
  

  if (isMousePressed) {
    endPoints.push(endV)
  } else {
    drawing = true
    // endPoints.length = 0
  }

  if (drawing) {
    if (endPoints.length) endV = endPoints.pop()
    else drawing = false
  }

  endPoints.forEach(pt => {
    point(pt.x, pt.y, '#ff572255')
  })



  line(startV, endV, '#2196f3aa')
  point(startV.x, startV.y, '#673ab7')
}

function scalarProhection() {
  const mouseV = new Vector(mouseX, mouseY)
  let a = Vector.sub(mouseV, v1Pos)

  let v1Copy = v1.copy()
  v1Copy.normalize()
  // let sp = a.dot(v1Copy)
  let sp = v1Copy.dot(a)
  v1Copy.mult(sp)

  let pt = Vector.add(v1Copy, v1Pos)

  line(v1Pos, Vector.add(v1Pos, v1), '#fafafa55')
  point(pt.x, pt.y, '#9c27b0')

  line(v1Pos, mouseV, '#2196f3')
  line(mouseV, pt, '#2196f355')
  line(v1Pos, pt, '#4caf5055')

  ctx.fillStyle = '#ffeb3b22'
  ctx.beginPath()
  ctx.moveTo(v1Pos.x, v1Pos.y)
  ctx.lineTo(mouseV.x, mouseV.y)
  ctx.lineTo(pt.x, pt.y)
  ctx.lineTo(v1Pos.x, v1Pos.y)
  ctx.fill()
}