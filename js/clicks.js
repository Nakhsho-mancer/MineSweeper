'use strict'

// icons
const BOOM = "💣"
const FLAG = "🏴‍☠️"

// capture cells table for easier access
const elContainter = document.querySelector('.board-container')

// global click boolians to direct to relavant functions
var gLeftClick = false
var gRightClick = false

// disables right click menu
elContainter.addEventListener('contextmenu', event => event.preventDefault())

elContainter.addEventListener('mousedown', event => {
    // consts to capture DOM element and relevant indexes
    const elCell = event.target
    if (elCell.classList.value === 'table') return
    const cellRowIdx = +elCell.dataset.row
    const cellColIdx = +elCell.dataset.col

    // assigns boolians
    if (event.button === 0) gLeftClick = true
    if (event.button === 2) gRightClick = true

    // direct to appropriate function
    if (gLeftClick && !gRightClick) cellClick(elCell, cellRowIdx, cellColIdx)
    if (!gLeftClick && gRightClick) cellFlagged(elCell, cellRowIdx, cellColIdx)
    if (gLeftClick && gRightClick) rightAndLeftClick(cellRowIdx, cellColIdx)
})

// reverts boolians
elContainter.addEventListener('mouseup', event => {
    if (event.button === 0) gLeftClick = false
    if (event.button === 2) gRightClick = false
})

function cellClick(elCell, i, j) {
    if (!gGame.isOn) return

    // capture model element by index
    const modelCell = gBoard[i][j]

    // exit conditions
    if (modelCell.isFlagged) return
    if (modelCell.isRevealed) return

    // update model
    modelCell.isRevealed = true

    if (modelCell.isMine) {
        // update model for mine, later lives will be added to logic
        elCell.innerText = BOOM
        gGame.currentMines--
        updateMinesLeft()
        handleDefeat()
    }

    // if the cell is "safe"
    else {
        // update model
        gGame.revealedCells++

        // if it was the first cell start timer, later rendering for safe will be added
        if (gGame.revealedCells === 1) {
            firstClick(elCell, i, j)
            return
        }

        // if it was the last cell
        if (gGame.revealedCells === gGame.goal) handleVictory()

        // update DOM
        elCell.innerText = modelCell.neighboringMines

        // if the cell was "0" calls revealing function
        if (!modelCell.neighboringMines) recursiveReveal(i, j)
    }
}

function cellFlagged(elCell, i, j) {
    if (!gGame.isOn) return

    // capture model element
    const modelCell = gBoard[i][j]

    // exit condition
    if (modelCell.isRevealed) return

    // switch back from existing flag and apply to model
    modelCell.isFlagged = !modelCell.isFlagged
    gGame.currentMines = (modelCell.isFlagged ? gGame.currentMines - 1 : gGame.currentMines + 1)

    // updates DOM
    elCell.innerText = (modelCell.isFlagged ? FLAG : '')
    updateMinesLeft()
}

function rightAndLeftClick(i, j) {
    if (!gGame.isOn) return

    // capture model element
    const modelCell = gBoard[i][j]

    // exit conditions
    if (!modelCell.isRevealed || modelCell.isFlagged) return

    // variable and neighbors loop for currect simultaneous click logic
    var flagsAround = 0
    const neighborsArray = returnNeighborsIndexes(i, j)

    for (var k = 0; k < neighborsArray.length; k++) {
        const currCell = gBoard[neighborsArray[k].i][neighborsArray[k].j]
        if (currCell.isFlagged) flagsAround++
    }

    // calls for area reveal
    if (modelCell.neighboringMines === flagsAround) recursiveReveal(i, j)
    else return
}

function recursiveReveal(rowIdx, colIdx) {
    const neighborsArray = returnNeighborsIndexes(rowIdx, colIdx)

    // neighbors loop
    for (var k = 0; k < neighborsArray.length; k++) {
        const currI = neighborsArray[k].i
        const currJ = neighborsArray[k].j
        const currCell = gBoard[currI][currJ]

        // continue conditions
        if (currCell.isFlagged) continue
        if (currCell.isRevealed) continue

        // updates model
        currCell.isRevealed = true
        gGame.revealedCells++

        // updates DOM
        const elCell = document.querySelector(`[data-row="${currI}"][data-col="${currJ}"]`)
        elCell.innerText = currCell.neighboringMines

        // checks other "0" cells for expanded area reveal and victory condition
        if (!currCell.neighboringMines) recursiveReveal(currI, currJ)
        if (gGame.revealedCells === gGame.goal) handleVictory()
    }
}