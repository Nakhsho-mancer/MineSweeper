'use strict'

// consts for different levels
const easy = { name: 'easy', rows: 4, columns: 4, mines: 2 }
const intermediate = { name: 'intermediate', rows: 9, columns: 9, mines: 10 }
const hard = { name: 'hard', rows: 16, columns: 16, mines: 40 }
const expert = { name: 'expert', rows: 16, columns: 30, mines: 99 }
const levelsArray = [ /* tba custom*/ easy, intermediate, hard, expert]

// new game icons
const SMILE = "🙂"
const SUN_GLASSES = "😎"
const SKULL = "💀"

// DOM elements needed for global functions
const elTimer = document.querySelector('.timer')
const elResetButton = document.querySelector('.restart-button')
const elEndModal = document.querySelector('.end-modal')
const elDifficultySetting = document.querySelectorAll('input[name="difficulty"]')

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
    levelSelected: intermediate,
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

// event listener loop for when user changes difficulty settings
elDifficultySetting.forEach(radio => {
    radio.addEventListener('change', function () {

        // captures new difficulty value
        const difficultySTR = this.value

        // loops on difficulties array
        for (var i = 0; i < levelsArray.length; i++) {

            // changes global difficulty value and relaunch game
            if (levelsArray[i].name === difficultySTR) {
                gGame.levelSelected = levelsArray[i]
                onInit()
                document.querySelector('.difficulty-settings-container').classList.add('hidden')
                document.querySelector('.helpers-box').classList.add('hidden')
                break
            }
        }
    })
})

function handleVictory() {
    // sends appropriate boolian to end game function
    handleGameEnd(true)
}

function handleDefeat() {
    // sends appropriate boolian to end game function
    handleGameEnd(false)
}

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