'use strict'

// capture cells table for easier access
const elContainter = document.querySelector('.board-container')

// global click boolians to direct to relavant functions
var gLeftClick = false
var gRightClick = false
var gHintClick = false
var gMegaHintClick = 0
var gMegaArray = []


// disables right click menu
elContainter.addEventListener('contextmenu', event => event.preventDefault())

// event listener instead of "click calls" from HTML to handle multiple situations
elContainter.addEventListener('mousedown', event => {
    // consts to capture DOM element and relevant indexes
    const elCell = event.target

    // condition to ignore space between cells or "out of bound" clicks
    if (elCell.classList.contains('dont-click')) return

    const cellRowIdx = +elCell.dataset.row
    const cellColIdx = +elCell.dataset.col

    // assigns boolians
    if (event.button === 0) gLeftClick = true
    if (event.button === 2) gRightClick = true

    // direct to appropriate function
    if (gLeftClick && !gRightClick) cellClick(elCell, cellRowIdx, cellColIdx)
    if (!gLeftClick && gRightClick) cellFlagged(elCell, cellRowIdx, cellColIdx)
    if (gLeftClick && gRightClick) leftAndRightClick(cellRowIdx, cellColIdx)
})

// reverts boolians on mouse release
elContainter.addEventListener('mouseup', event => {
    if (event.button === 0) gLeftClick = false
    if (event.button === 2) gRightClick = false
})

function cellClick(elCell, i, j) {
    if (!gGame.isOn) return

    // capture model element by index
    const modelCell = gBoard[i][j]

    // mega hint condition
    if (gMegaHintClick) {
        // saves indexes in objects array
        gMegaArray.push({ i, j })
        gMegaHintClick--

        // sends to renderer when finished
        if (!gMegaHintClick) renderMega(gMegaArray)
        return
    }

    // exit conditions
    if (modelCell.isFlagged) return
    if (modelCell.isRevealed) return

    // hint condition
    if (gHintClick) {
        timedReveal(i, j)
        return
    }

    // update model
    modelCell.isRevealed = true

    if (modelCell.isMine) {
        // update model mines and lives
        gGame.currentMines--
        gHelpers.lives--
        
        // updates DOM
        elCell.innerText = BOOM
        elCell.classList.add('clicked-mine')

        // calls appopriate functions
        updateMinesLeft()
        updateLives()
    }

    // if the cell is "safe"
    else {
        // update model
        gGame.revealedCells++

        // if it was the first cell call initalizing function
        if (gGame.revealedCells === 1) {
            firstClick(elCell, i, j)
            return
        }

        // if it was the last cell call ending function
        if (gGame.revealedCells === gGame.goal) handleGameEnd(true)

        // update DOM
        elCell.classList.add('revealed-cell')
        elCell.innerText = (modelCell.neighboringMines ? modelCell.neighboringMines : '')

        // if the cell was "0" calls recursive revealing function
        if (!modelCell.neighboringMines) recursiveReveal(i, j)
    }
}

function cellFlagged(elCell, i, j) {
    // capture model element
    const modelCell = gBoard[i][j]

    // exit conditions
    if (!gGame.isOn || !gGame.revealedCells || modelCell.isRevealed) return

    // toggle existing flag and apply to model
    modelCell.isFlagged = !modelCell.isFlagged
    gGame.currentMines = (modelCell.isFlagged ? gGame.currentMines -= 1 : gGame.currentMines += 1)

    // updates DOM
    elCell.innerText = (modelCell.isFlagged ? FLAG : '')
    updateMinesLeft()
}

function leftAndRightClick(i, j) {
    // exit conditions
    if (!gGame.isOn || gHintClick || gMegaHintClick) return

    // capture model element
    const modelCell = gBoard[i][j]

    // more exit conditions :-)
    if (!modelCell.isRevealed || modelCell.isFlagged) return

    // variable and neighbors loop for correct simultaneous click logic
    var flagsAround = 0
    const neighborsArray = returnNeighborsIndexes(i, j)

    for (var k = 0; k < neighborsArray.length; k++) {
        // capture cell to check
        const currCell = gBoard[neighborsArray[k].i][neighborsArray[k].j]
        // update conditional variable with flags or exploded mines
        if (currCell.isFlagged || (currCell.isMine && currCell.isRevealed)) flagsAround++
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

        // condition for misplaced flags
        if (currCell.isMine) {
            gGame.currentMines--
            gHelpers.lives--

            updateMinesLeft()
            updateLives()
        }
        
        else gGame.revealedCells++

        // updates DOM
        const elCell = document.querySelector(`[data-row="${currI}"][data-col="${currJ}"]`)
        elCell.classList.add('revealed-cell')
        if (currCell.isMine) {
            elCell.innerText = BOOM
            elCell.classList.add('clicked-mine')
        }
        else elCell.innerText = (currCell.neighboringMines ? currCell.neighboringMines : '')

        // checks other "0" cells for expanded area reveal and victory condition
        if (!currCell.neighboringMines && !currCell.isMine) recursiveReveal(currI, currJ)
        if (gGame.revealedCells === gGame.goal) handleGameEnd(true)
    }
}