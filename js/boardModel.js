'use strict'

// global variable
var gBoard = []

function buildBoard(levelSelected) {
    // gets paramaters from the selected level
    const height = levelSelected.rows
    const width = levelSelected.columns

    // initalize board
    var boardArray = []

    for (var i = 0; i < height; i++) {
        // initalize row
        boardArray[i] = []

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

function placeMines(mines) {
    // loops mine count
    for (var i = 0; i < mines; i++) {
        const currCell = getRandomCell()

        // retry the step if it caught an already existing mine
        if (currCell.isMine || currCell.isRevealed) i--

        // updates model
        else currCell.isMine = true
    }
}

function countMinesAround(rowIdx, colIdx) {
    var minesAround = 0
    const neighborsArray = returnNeighborsIndexes(rowIdx, colIdx)
    
    // neighbors loop, counts mines around
    for (var k = 0; k < neighborsArray.length; k++) {
        const currCell = gBoard[neighborsArray[k].i][neighborsArray[k].j]

        if (currCell.isMine) minesAround++
    }

    return minesAround
}