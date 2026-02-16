'use strict'

// global helpers variable
var gHelpers = {
    lives: 3,
    safeClicks: 3
}

// global helpers boolians
var gHelpersBoolians = {
    lives: true,
    hints: true,
    safeClicks: true,
    exterminator: true,
    megaHint: true
}

function handleHelperCheckbox(event, helperID) {
    switch (helperID) {
        case "lives":
            gHelpersBoolians.lives = (event.target.checked ? true : false)
            onInit()
            break

        case "hints":
            gHelpersBoolians.hints = (event.target.checked ? true : false)
            onInit()
            break

        case "safeClicks":
            gHelpersBoolians.safeClicks = (event.target.checked ? true : false)
            onInit()
            break

        case "exterminator":
            gHelpersBoolians.exterminator = (event.target.checked ? true : false)
            onInit()
            break

        case "megaHint":
            gHelpersBoolians.megaHint = (event.target.checked ? true : false)
            onInit()
            break

        case "deselect":
            const bool = (event.target.checked ? false : true)
            const elHelpers = document.getElementsByName('helpers')
            for (var i = 0; i < Object.keys(gHelpersBoolians).length; i++) {
                gHelpersBoolians[Object.keys(gHelpersBoolians)[i]] = bool
                elHelpers[i].checked = bool
            }
            onInit()
            break
    }
}

function resetHelpers() {
    // resets helpers model elements
    gHelpers.lives = (!gHelpersBoolians.lives ? 1 : (gGame.levelSelected === levelsArray[0]) ? 2 : 3)
    gHintClick = false
    gHelpers.safeClicks = (gHelpersBoolians.safeClicks ? 3 : 0)
    gMegaHintClick = 0
    gMegaArray = []

    // resets helpers DOM
    if (gHelpersBoolians.exterminator) document.querySelector('.exterminator').classList.remove('hidden')
    else document.querySelector('.exterminator').classList.add('hidden')
    if (gHelpersBoolians.megaHint) document.querySelector('.mega-hint').classList.remove('hidden')
    else document.querySelector('.mega-hint').classList.add('hidden')

    updtaeLives()
    resetHints()
    renderSafeBtn()
}

function handleSafeClick() {
    // exit conditions
    if (!gGame.isOn || !gGame.revealedCells || !gHelpers.safeClicks) return

    // gets random indexes
    const i = getRandomInt(0, gBoard.length)
    const j = getRandomInt(0, gBoard[0].length)
    const currCell = gBoard[i][j]

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
    if (gHelpers.lives === 0) handleGameEnd(false)

    // capture DOM element and updates according to model count
    const elLives = document.querySelector('.lives')
    elLives.innerText = gHelpers.lives
}

function handleHint(elHintBtn) {
    // conditions to make sure clicks are appropriate
    if (!gGame.isOn || !gGame.revealedCells || gHintClick || gMegaHintClick) return

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
        hint.classList.remove('hidden')
    }
}

function handleExterminator(elExterBtn) {
    // exit conditions
    if (!gGame.isOn || !gGame.revealedCells || gGame.currentMines < 4) return

    // loops for random cells until it captures 3 mines
    for (var k = 0; k < 3; k++) {
        const i = getRandomInt(0, gBoard.length)
        const j = getRandomInt(0, gBoard[0].length)
        const currCell = gBoard[i][j]

        if (!currCell.isMine) {
            k--
            continue
        }
        else currCell.isMine = false

        if (currCell.isFlagged) {
            currCell.isFlagged = false
            currCell.isRevealed = true
            document.querySelector(`[data-row="${i}"][data-col="${j}"]`).innerText = ''
            document.querySelector(`[data-row="${i}"][data-col="${j}"]`).classList.add('revealed-cell')
        }
        // when it finds mine updates victory condition if revealed
        if (currCell.isRevealed) gGame.revealedCells++
    }

    // updates model
    gGame.currentMines -= 3
    gGame.goal += 3
    updateNeighborCount(gBoard)

    // loops the board to update revealed cells DOM
    for (var k = 0; k < gBoard.length; k++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            const currCell = gBoard[k][j]

            if (currCell.isRevealed && !currCell.isMine) {
                const elCell = document.querySelector(`[data-row="${k}"][data-col="${j}"]`)
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

function handleMegaHint(elMegaBtn) {
    // exit conditions
    if (!gGame.isOn || !gGame.revealedCells || gHintClick) return

    // sets special clicks condition
    gMegaHintClick = 2

    // updates DOM button
    elMegaBtn.classList.add('hidden')
}

function renderMega(megaArray) {
    // variables to capture indexes from array
    var rowStart
    var rowEnd
    var colStart
    var colEnd

    // conditions to set start and end indexes
    if (megaArray[0].i < megaArray[1].i) {
        rowStart = megaArray[0].i
        rowEnd = megaArray[1].i
    }
    else {
        rowStart = megaArray[1].i
        rowEnd = megaArray[0].i
    }
    if (megaArray[0].j < megaArray[1].j) {
        colStart = megaArray[0].j
        colEnd = megaArray[1].j
    }
    else {
        colStart = megaArray[1].j
        colEnd = megaArray[0].j
    }

    // loop reveal
    for (var i = rowStart; i <= rowEnd; i++) {
        for (var j = colStart; j <= colEnd; j++) {
            const currCell = gBoard[i][j]

            // continue conditions
            if (currCell.isFlagged) continue
            if (currCell.isRevealed) continue

            // updates DOM only
            const elCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
            elCell.classList.add('revealed-cell')
            elCell.innerText =
                (currCell.isMine ? BOOM : currCell.neighboringMines ? currCell.neighboringMines : '')

        }
    }

    // timeout to reverse reveal
    setTimeout(() => {
        for (var i = rowStart; i <= rowEnd; i++) {
            for (var j = colStart; j <= colEnd; j++) {
                const currCell = gBoard[i][j]

                if (currCell.isFlagged) continue
                if (currCell.isRevealed) continue

                const elCell = document.querySelector(`[data-row="${i}"][data-col="${j}"]`)
                elCell.classList.remove('revealed-cell')
                elCell.innerText = ''
            }
        }
    }, 2000)
}