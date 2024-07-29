import { getCustomProperty, incrementCustomProperty, setCustomProperty } from "./updateCustomProperties.js"

const halElem = document.querySelector("[data-hal]")
const JUMP_SPEED = 0.45
const GRAVITY = 0.0015
const HAL_FRAME_COUNT = 3
const FRAME_TIME = 100

let isJumping
let halFrame
let currentFrameTime
let yVelocity
export function setupHal() {
    isJumping = false
    halFrame = 0
    currentFrameTime = 0
    yVelocity = 0
    setCustomProperty(halElem, "--bottom", 0)
    document.removeEventListener("keydown", onJump)
    document.addEventListener("keydown", onJump)
}

export function updateHal(delta, speedScale) {
    handleRun(delta, speedScale)
    handleJump(delta)

}

export function getHalRect() {
    return halElem.getBoundingClientRect()
}

export function setHalLose() {
    halElem.src = "./img/Hal-lose.png"
}

function handleRun(delta, speedScale) {
    if(isJumping) { 
        halElem.src = `img/Hal-run-0.png`
        return
    }

    if (currentFrameTime >= FRAME_TIME){
        halFrame = (halFrame + 1) % HAL_FRAME_COUNT
        halElem.src = `img/Hal-run-${halFrame}.png`
        currentFrameTime -=  FRAME_TIME
    }
    currentFrameTime += delta * speedScale
}

function handleJump(delta){
    if (!isJumping) return
    incrementCustomProperty(halElem, "--bottom", yVelocity * delta)

    if (getCustomProperty(halElem, "--bottom") <= 0) {
        setCustomProperty(halElem, "--bottom", 0)
        isJumping = false
    }
    yVelocity -= GRAVITY * delta

}

function onJump(e) {
    if(e.code !== "Space" || isJumping) return

    yVelocity = JUMP_SPEED
    isJumping = true
}


