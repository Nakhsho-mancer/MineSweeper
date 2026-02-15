'use strict'

// global variables
var gBoard

function buildBoard(levelSelected) {
    // gets paramaters from the level selected
    const height = levelSelected.rows
    const width = levelSelected.columns

    // inital board
    var boardArray = []

    for (var i = 0; i < height; i++) {
        boardArray.push([])

        for (var j = 0; j < width; j++) {
            // fills matrix with "cell" elements
            const currCell = buildCell()
            boardArray[i][j] = currCell
        }
    }
    return boardArray
}

function buildCell() {
    // initial cell
    return {
        neighboringMines: 0,
        isRevealed: false,
        isMine: false,
        isFlagged: false
    }
}

function updateNeighborCount(board) {
    // runs accross the board and assigns mines around count
    for (var i = 0; i < board.length; i++) {

        for (var j = 0; j < board[0].length; j++) {
            // captures model element
            const currCell = board[i][j]

            // skips mines
            if (currCell.isMine) continue

            // updates model
            currCell.neighboringMines = countMinesAround(i, j)
        }
    }
}

function placeMines(board, mines) {
    // loops mine count
    for (var i = 0; i < mines; i++) {
        const rowIdx = getRandomInt(0, board.length)
        const colIdx = getRandomInt(0, board[0].length)

        // retry the step if it caught an already existing mine
        if (board[rowIdx][colIdx].isMine || board[rowIdx][colIdx].isRevealed) i--

        // updates model
        else {
            board[rowIdx][colIdx].isMine = true
        }
    }
}

function countMinesAround(rowIdx, colIdx) {
    // neighbors loop, counts mines around
    var minesAround = 0
    const neighborsArray = returnNeighborsIndexes(rowIdx, colIdx)

    for (var counter = 0; counter < neighborsArray.length; counter++) {
        const currCell = gBoard[neighborsArray[counter].i][neighborsArray[counter].j]

        if (currCell.isMine) minesAround++
    }

    return minesAround
}

function updtaeLives() {
    // checks losing condition
    if (gGame.livesLeft === 0) handleDefeat()

    // capture DOM element and updates according to model count
    const elLives = document.querySelector('.lives')
    elLives.innerText = gGame.livesLeft
}

function handleHint(elHintBtn) {
    // conditions to make sure clicks are appropriate
    if (!gGame.isOn || !gGame.revealedCells || gHintClick) return

    // applies special click action
    gHintClick = true

    // updates DOM
    elHintBtn.classList.add('hidden')
}