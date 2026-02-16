'use strict'

// icons
const BOOM = "💣"
const FLAG = "🏴‍☠️"
const WRONG = "❌"
const HINT = "💡"
const EXTERMINATOR = "🔥"

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

function settingsBtn() {
    document.querySelector('.difficulty-settings-container').classList.toggle('hidden')
    document.querySelector('.helpers-box').classList.toggle('hidden')
}