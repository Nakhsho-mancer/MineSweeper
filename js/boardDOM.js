'use strict'

// icons
const BOOM = "💣"
const FLAG = "🏴‍☠️"
const WRONG = "❌"
const HINT = "💡"

function renderBoard(board) {
    // renders the board from the global board array
    var strHTML = '<table class="dont-click"><tbody>'

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

    updateMinesLeft()
    updtaeLives()
    resetHints()
}

function renderEndBoard() {
    // loops the board in search of mines and flags
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]

            // non flaged mines
            if (!currCell.isFlagged && currCell.isMine) {
                const elCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
                elCell.innerText = BOOM
            }

            // misplaced flags
            if (currCell.isFlagged && !currCell.isMine) {
                const elCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
                elCell.innerText = WRONG
            }
        }
    }
}

function updateMinesLeft() {
    // capture DOM element and updates according to model count
    const elMinesLeft = document.querySelector('.mines-remaining span')
    elMinesLeft.innerText = gGame.currentMines
}

function resetHints() {
    // loop 3 times for hints
    for (var i = 1; i <= 3; i++) {
        // capture DOM element
        const hint = document.querySelector(`.hint${i}`)

        // reset it
        hint.classList.remove('hidden')
        hint.innerText = HINT
    }
}

function settingsBtn() {
    document.querySelector('.settings-container').classList.toggle('hidden')
}

function timedReveal(rowIdx, colIdx) {
    const neighborsArray = returnNeighborsIndexes(rowIdx, colIdx)
    // pushes original cell into array since no model changes are using it
    neighborsArray.push({ i: rowIdx, j: colIdx })

    // neighbors loop
    for (var k = 0; k < neighborsArray.length; k++) {
        const currI = neighborsArray[k].i
        const currJ = neighborsArray[k].j
        const currCell = gBoard[currI][currJ]

        // continue conditions
        if (currCell.isFlagged) continue
        if (currCell.isRevealed) continue

        // updates DOM only, checking both mines and normal cells
        const elCell = document.querySelector(`[data-row="${currI}"][data-col="${currJ}"]`)
        elCell.classList.toggle('revealed-cell')
        elCell.innerText =
            (currCell.isMine ? BOOM :
                currCell.neighboringMines ? currCell.neighboringMines : '')
    }

    // timeout to revert DOM changes
    setTimeout(() => {
        for (var k = 0; k < neighborsArray.length; k++) {
            const currI = neighborsArray[k].i
            const currJ = neighborsArray[k].j
            const currCell = gBoard[currI][currJ]

            // continue conditions
            if (currCell.isFlagged) continue
            if (currCell.isRevealed) continue

            // updates DOM
            const elCell = document.querySelector(`[data-row="${currI}"][data-col="${currJ}"]`)
            elCell.classList.toggle('revealed-cell')
            elCell.innerText = ''
        }
    }, 1500)
    gHintClick = false
}