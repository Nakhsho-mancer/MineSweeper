'use strict'

// objects array for different levels
const levelsArray = [
    { name: 'easy', rows: 4, columns: 4, mines: 2 },
    { name: 'intermediate', rows: 9, columns: 9, mines: 10 },
    { name: 'hard', rows: 16, columns: 16, mines: 40 },
    { name: 'expert', rows: 16, columns: 30, mines: 99 },
    { name: 'manual', rows: 0, columns: 0, mines: 0 }
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

    // gets local storage
    getHighScoresStorage()
}

// resets game on difficulty change
function changeDifficulty(difficultyValue) {

    gGame.levelSelected = levelsArray[difficultyValue]
    if (gGame.levelSelected === levelsArray[4]) {
        handleManualDifficulty()
    }
    onInit()

    // rehide settings box (as long as manual box isn't still changed by user)
    if ((difficultyValue !== '4') || (gGame.levelSelected === levelsArray[4])) {
        document.querySelector('.difficulty-settings-container').classList.add('hidden')
        document.querySelector('.helpers-box').classList.add('hidden')
    }
}

function handleManualDifficulty() {
    // gets user's desired values
    const elRows = document.getElementById('manual-rows').value
    const elCols = document.getElementById('manual-columns').value
    const elMines = document.getElementById('manual-mines').value

    // makes sure they're valid, otherwise reselects 'default'
    if (elRows < 1 || elRows > 99 || elCols < 1 || elCols > 99 || elMines >= (elRows * elCols - 1)) {
        gGame.levelSelected = levelsArray[1]
        document.getElementById('intermediate').checked = true
        return
    }

    // updates model
    levelsArray[4].rows = elRows
    levelsArray[4].columns = elCols
    levelsArray[4].mines = elMines
}

// victory/defeat function, gets a boolian
function handleGameEnd(win) {
    // updates model
    gGame.isOn = false
    clearInterval(gTimer.timerInterval)
    if (win && (gGame.levelSelected !== levelsArray[4])) handleHighScore(gGame.levelSelected)
        
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
        elCell.innerText = ''
    }

    else {

        elCell.innerText = modelCell.neighboringMines
    }

    elCell.classList.add('revealed-cell')
    // starts the timer
    startTimer()
}