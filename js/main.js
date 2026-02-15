'use strict'

// consts for different levels
const easy = { rows: 4, columns: 4, mines: 2 }
const intermediate = { rows: 9, columns: 9, mines: 10 }
const hard = { rows: 16, columns: 16, mines: 40 }
const expert = { rows: 16, columns: 30, mines: 99 }
const levelsArray = [ /* tba custom*/ easy, intermediate, hard, expert]

// new game icons
const SMILE = "🙂"
const SUN_GLASSES = "😎"
const SKULL = "💀"

// DOM elements needed for global functions
const elTimer = document.querySelector('.timer')
const elResetButton = document.querySelector('.restart-button')
const elEndModal = document.querySelector('.end-modal')

// model variables
var gBoard

var gTimer = {
    timerStart: 0,
    timerInterval: 0,
    timerEnd: 0
}


var gGame = {
    isOn: false,
    revealedCells: 0,
    timePassed: 0,
    currentMines: 0,
    goal: 0,
    levelSelected: intermediate
}

// main function, called on start and on new game
function onInit() {
    // builds model
    gBoard = buildBoard(gGame.levelSelected)

    // resets global game elements, mostly needed for new games
    gGame.currentMines = gGame.levelSelected.mines
    gGame.revealedCells = 0
    gGame.timePassed = 0
    gGame.goal = gGame.levelSelected.rows * gGame.levelSelected.columns - gGame.levelSelected.mines
    gGame.isOn = true

    // resets timer
    gTimer.timerStart = 0
    gTimer.timerEnd = 0
    clearInterval(gTimer.timerInterval)

    // resets DOM elements
    elTimer.innerText = '00:00:000'
    elResetButton.innerText = SMILE
    elEndModal.classList.add('hidden')

    // renders DOM
    renderBoard(gBoard)
    updateMinesLeft()
}

function handleVictory() {
    // updates model
    gGame.isOn = false
    clearInterval(gTimer.timerInterval)

    // updates DOM
    elResetButton.innerText = SUN_GLASSES
    elEndModal.innerText = 'Victory!'
    elEndModal.classList.remove('hidden')
}

function handleDefeat() {
    // updates model
    gGame.isOn = false
    clearInterval(gTimer.timerInterval)

    // updates DOM
    elResetButton.innerText = SKULL
    elEndModal.innerText = 'Game over'
    elEndModal.classList.remove('hidden')
}

function startTimer() {
    // saves start of timer globaly
    gTimer.timerStart = Date.now()

    // sets fixed updates
    gTimer.timerInterval = setInterval(updateTimer, 24)
}

function firstClick(elCell, i, j) {
    // captures first cell clicked
    const modelCell = gBoard[i][j]
    modelCell.isRevealed = true

    // builds around it
    placeMines(gBoard, gGame.levelSelected.mines)
    updateNeighborCount(gBoard)

    // if the cell was "0" calls revealing function
    if (!modelCell.neighboringMines) recursiveReveal(i, j)

    // updates DOM and starts the timer
    elCell.innerText = modelCell.neighboringMines
    startTimer()
}