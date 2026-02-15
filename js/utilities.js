'use strict'

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

function placeMines(board, mines) {
    // loops mine count
    for (var i = 0; i < mines; i++) {
        const rowIdx = getRandomInt(0, board.length)
        const colIdx = getRandomInt(0, board[0].length)

        // retry the step if it caught an already existing mine
        if (board[rowIdx][colIdx].isMine || board[rowIdx][colIdx].isRevealed) i--

        // updates model
        else board[rowIdx][colIdx].isMine = true
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

// I needed neighbors loop for multiple other functions so I 
// just made this general function that returns array of indexes
function returnNeighborsIndexes(rowIdx, colIdx) {

    const res = []

    for (var i = rowIdx - 1; i < rowIdx + 2; i++) {
        // skips rows out of bound
        if (i < 0 || i >= gBoard.length) continue

        for (var j = colIdx - 1; j < colIdx + 2; j++) {
            // skips columns out of bound
            if (j < 0 || j >= gBoard[i].length) continue
            // skips initial cell that called for neighbors
            if (i === rowIdx && j === colIdx) continue

            // creates index element and pushes into result
            const currCell = { i, j }
            res.push(currCell)
        }
    }
    return res
}

function updateMinesLeft() {
    // capture DOM element and updates according to model count
    const elMinesLeft = document.querySelector('.mines-remaining span')
    elMinesLeft.innerText = gGame.currentMines
}

function updateTimer() {
    // local const for calculations
    const currTime = Date.now()

    // updates model and saves the time globaly for high scores to be added
    gTimer.timerEnd = currTime - gTimer.timerStart

    // variables to make time passed legible
    var timerMins = Math.floor(gTimer.timerEnd / 60000).toString()
    if (timerMins.length === 1) timerMins = '0' + timerMins
    var timerSecs = Math.floor(gTimer.timerEnd / 1000).toString()
    if (timerSecs.length === 1) timerSecs = '0' + timerSecs
    var timerMillis = Math.floor(gTimer.timerEnd % 1000).toString()
    if (timerMillis.length === 1) timerMillis = '00' + timerMillis
    else if (timerMillis.length === 2) timerMillis = '0' + timerMillis

    // updates DOM
    elTimer.innerText = `${timerMins}:${timerSecs}:${timerMillis}`
}

function getRandomInt(min, max) {
    // magic function  ;-)
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}