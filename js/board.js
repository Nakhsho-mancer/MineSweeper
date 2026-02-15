'use strict'

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

function renderBoard(board) {
    // renders the board from the global board array
    var strHTML = '<table class="table"><tbody>'

    for (var i = 0; i < board.length; i++) {
        // row start
        strHTML += '<tr>'

        for (var j = 0; j < board[0].length; j++) {

            // individual cells with data indexes
            // for use by different functions
            strHTML += `<td class="cell" 
                        data-row="${i}" 
                        data-col="${j}">
                        </td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'

    // update DOM
    elContainter.innerHTML = strHTML
}
