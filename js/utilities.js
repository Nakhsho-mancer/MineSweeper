'use strict'

// I needed neighbors loop for multiple functions so I 
// made this general function that returns array of indexes
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

function updateTimer() {
    // local const for calculations
    const currTime = Date.now()

    // updates model and saves the time globaly for high scores to be added
    gTimer.timerEnd = currTime - gTimer.timerStart

    const legibleTime = makeTimeLegible(gTimer.timerEnd)

    // updates DOM
    elTimer.innerText = legibleTime
}

function makeTimeLegible(illegibleTime) {
    // variables to make time passed legible
    var timerMins = Math.floor(illegibleTime / 60000).toString()
    if (timerMins.length === 1) timerMins = '0' + timerMins
    var timerSecs = Math.floor((illegibleTime / 1000) % 60).toString()
    if (timerSecs.length === 1) timerSecs = '0' + timerSecs
    var timerMillis = Math.floor(illegibleTime % 1000).toString()
    if (timerMillis.length === 1) timerMillis = '00' + timerMillis
    else if (timerMillis.length === 2) timerMillis = '0' + timerMillis

    return `${timerMins}:${timerSecs}:${timerMillis}`
}

function getRandomCell() {
    const i = getRandomInt(0, gBoard.length)
    const j = getRandomInt(0, gBoard[0].length)

    return gBoard[i][j]
}

function getRandomInt(min, max) {
    // magic function  ;-)
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}