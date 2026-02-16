'use strict'

// objects array for different levels
const levelsArray = [
    { name: 'easy', rows: 4, columns: 4, mines: 2 },
    { name: 'intermediate', rows: 9, columns: 9, mines: 10 },
    { name: 'hard', rows: 16, columns: 16, mines: 40 },
    { name: 'expert', rows: 16, columns: 30, mines: 99 }
]

// new game icons
const SMILE = "🙂"
const SUN_GLASSES = "😎"
const SKULL = "💀"

// DOM elements needed for global functions
const elTimer = document.querySelector('.timer')
const elResetButton = document.querySelector('.restart-button')
const elEndModal = document.querySelector('.end-modal')

// model variables
var gTimer = {
    timerStart: 0,
    timerInterval: 0,
    timerEnd: 0
}

var gGame = {
    revealedCells: 0,
    currentMines: 0,
    goal: 0,
    levelSelected: levelsArray[1],
    isOn: false
}

// main function, called on start and on new game
function onInit() {
    // builds model
    gBoard = buildBoard(gGame.levelSelected)

    // resets global game elements, mostly needed for new games
    gGame.revealedCells = 0
    gGame.currentMines = gGame.levelSelected.mines
    gGame.goal = gGame.levelSelected.rows * gGame.levelSelected.columns - gGame.levelSelected.mines
    gGame.isOn = true
    resetHelpers()

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
}

// resets game on difficulty change
function changeDifficulty(difficultyValue) {
    gGame.levelSelected = levelsArray[difficultyValue]
    onInit()
}

// victory/defeat function, gets a boolian
function handleGameEnd(win) {
    // updates model
    gGame.isOn = false
    clearInterval(gTimer.timerInterval)

    // updates DOM
    renderEndBoard()
    elResetButton.innerText = (win ? SUN_GLASSES : SKULL)
    elEndModal.innerText = (win ? 'Victory!' : 'Game over')
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
    placeMines(gGame.levelSelected.mines)
    updateNeighborCount(gBoard)

    // if the cell was "0" calls revealing function
    if (!modelCell.neighboringMines) {
        recursiveReveal(i, j)

        // updates DOM
        elCell.classList.add('revealed-cell')
        elCell.innerText = ''
    }

    else {
        elCell.classList.add('revealed-cell')
        elCell.innerText = modelCell.neighboringMines
    }

    // starts the timer
    startTimer()
}