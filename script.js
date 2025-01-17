import { setupGround, updateGround } from "./ground.js"
import { setupHal, updateHal, getHalRect, setHalLose } from "./hal.js"
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js"
const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("[data-score]")
const startScreenElem = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })

setupGround()

let lastTime
let speedScale
let score
function update(time) {
    if(lastTime == null){
        lastTime = time
        window.requestAnimationFrame(update)
        return
}

const delta = time - lastTime

updateGround(delta, speedScale)
updateHal(delta, speedScale)
updateSpeedScale(delta)
updateScore(delta)
updateCactus(delta, speedScale)
if (checkLose()) return handleLose()

    lastTime = time
    window.requestAnimationFrame(update)

}

function checkLose(){
    const HalRect = getHalRect()
    return getCactusRects().some(rect => isCollision(rect, HalRect))
}

function isCollision(rect1, rect2) {
    return rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
}
function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE
}

function updateScore(delta) {
    score += delta * 0.01
    scoreElem.textContent = Math.floor(score)
}

function handleStart() {
    lastTime = null
    setupGround() 
    setupHal()
    setupCactus()
    speedScale = 1
    score = 0
    startScreenElem.classList.add("hide")
    window.requestAnimationFrame(update)
}

function handleLose () {
    setHalLose()
    setTimeout(() => {
        document.addEventListener("keydown", handleStart, { once: true})
        startScreenElem.classList.remove("hide")
    }, 100)
}

function setPixelToWorldScale () {
    let worldToPixelScale
    if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT)
        {
            worldToPixelScale = window.innerWidth / WORLD_WIDTH
        } else {
            worldToPixelScale = window.innerHeight / WORLD_HEIGHT
        }

    worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
    worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}