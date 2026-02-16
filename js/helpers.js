'use strict'

// DOM consts for user selected helpers
const elLivesCheck = document.getElementById('lives-helper')
const elHintsCheck = document.getElementById('hints-helper')
const elSafeClicksCheck = document.getElementById('safeClicks-helper')
const elExterminatorCheck = document.getElementById('exterminator-helper')

// global helpers variable
var gHelpers = {
    lives: 3,
    safeClicks: 3,
    megaHint: 1,
}

// global helpers boolians
var gHelpersBoolians = {
    lives: true,
    hints: true,
    safeClicks: true,
    exterminator: true,
    megaHint: true
}

// event listeners for helpers
elLivesCheck.addEventListener('change', function () {
    if (this.checked) gHelpersBoolians.lives = true
    else gHelpersBoolians.lives = false
    onInit()
})

elHintsCheck.addEventListener('change', function () {
    if (this.checked) gHelpersBoolians.hints = true
    else gHelpersBoolians.hints = false
    onInit()
})

elSafeClicksCheck.addEventListener('change', function () {
    if (this.checked) gHelpersBoolians.safeClicks = true
    else gHelpersBoolians.safeClicks = false
    onInit()
})

elExterminatorCheck.addEventListener('change', function () {
    if (this.checked) gHelpersBoolians.exterminator = true
    else gHelpersBoolians.exterminator = false
    onInit()
})

function resetHelpers() {
    // resets helpers model elements
    gHelpers.lives = (gHelpersBoolians.lives ? 3 : 1)
    gHelpers.safeClicks = (gHelpersBoolians.safeClicks ? 3 : 0)
    if (gHelpersBoolians.exterminator) document.querySelector('.exterminator').classList.remove('hidden')
    else document.querySelector('.exterminator').classList.add('hidden')

    // resets helpers DOM
    updtaeLives()
    resetHints()
    renderSafeBtn()
}

function handleSafeClick() {
    // exit conditions
    if (!gGame.isOn || !gGame.revealedCells || !gHelpers.safeClicks) return

    // gets random indexes
    const currCell = getRandomCell()

    // conditions for appropriate cell
    if (currCell.isMine || currCell.isFlagged || currCell.isRevealed) return handleSafeClick()

    // updates model
    gHelpers.safeClicks--

    // updates DOM
    const elCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
    elCell.classList.add('safe-mark')

    setTimeout(() => {
        elCell.classList.remove('safe-mark')
    }, 1500)

    // re-renders button
    renderSafeBtn()
}

function renderSafeBtn() {
    // captures DOM element and updates span
    const elSafeBtn = document.querySelector('.safe-clicks span')
    elSafeBtn.innerText = gHelpers.safeClicks

    // hides container when out of clicks
    if (gHelpers.safeClicks === 0)
        document.querySelector('.safe-clicks').classList.add('hidden')
    // return when reseting
    if (gHelpers.safeClicks === 3)
        document.querySelector('.safe-clicks').classList.remove('hidden')
}

function updtaeLives() {
    // checks losing condition
    if (gHelpers.lives === 0) handleDefeat()

    // capture DOM element and updates according to model count
    const elLives = document.querySelector('.lives')
    elLives.innerText = gHelpers.lives
}

function handleHint(elHintBtn) {
    // conditions to make sure clicks are appropriate
    if (!gGame.isOn || !gGame.revealedCells || gHintClick) return

    // applies special click action
    gHintClick = true
    gHelpers.hints--

    // updates DOM
    elHintBtn.classList.add('hidden')
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
        elCell.classList.add('revealed-cell')
        elCell.innerText =
            (currCell.isMine ? BOOM : currCell.neighboringMines ? currCell.neighboringMines : '')
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
            elCell.classList.remove('revealed-cell')
            elCell.innerText = ''
        }
    }, 1500)

    // returns left clicks to normal
    gHintClick = false
}

function resetHints() {
    // checks helper's boolian
    if (!gHelpersBoolians.hints) {
        document.querySelector('.hints').classList.add('hidden')
        return
    }
    else document.querySelector('.hints').classList.remove('hidden')

    // loop 3 times for hints
    for (var i = 1; i <= 3; i++) {
        // capture DOM element
        const hint = document.querySelector(`.hint${i}`)

        // reset it
        hint.innerText = HINT
        hint.classList.remove('hidden')
    }
}

function handleExterminator(elExterBtn) {
    // exit conditions
    if (!gGame.isOn || !gGame.revealedCells || gGame.currentMines < 4) return

    // loops for random cells until it captures 3 mines
    for (var i = 0; i < 3; i++) {
        const currCell = getRandomCell()

        if (!currCell.isMine) {
            i--
            continue
        }

        else currCell.isMine = false
        // when it finds mine updates victory condition if revealed
        if (currCell.isRevealed) gGame.revealedCells++
    }

    // updates model
    gGame.currentMines -= 3
    gGame.goal += 3
    updateNeighborCount(gBoard)

    // loops the board to update revealed cells DOM
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[i][j]

            if (currCell.isRevealed && !currCell.isMine) {
                const elCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
                elCell.innerText = (currCell.neighboringMines ? currCell.neighboringMines : '')
                elCell.classList.add('revealed-cell')
                elCell.classList.remove('clicked-mine')
            }
        }
    }
    // normal updates to DOM
    updateMinesLeft()
    elExterBtn.classList.add('hidden')
}