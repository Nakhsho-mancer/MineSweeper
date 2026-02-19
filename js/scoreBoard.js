'use strict'

// global model storage for highscores
var gHighScoresMat = []

function getHighScoresStorage() {
    // condition to check browser support
    if (typeof (Storage) !== undefined) {
        const tempArr = []

        // condtion to check if local storage already exist
        if (!localStorage.getItem("scores")) {

            // matrix loops to create "empty scores" array
            for (var i = 0; i < 4; i++) {
                tempArr[i] = []
                for (var j = 0; j < 10; j++) {
                    tempArr[i][j] = 0
                }
            }
            // stringify into local storage
            localStorage.setItem("scores", JSON.stringify(tempArr))
        }

        // if storage was found de-srtingify out into highscores array
        else {
            gHighScoresMat = JSON.parse(localStorage.getItem("scores"))
            renderScoreBoard()
        }
    }
}

function handleHighScore(level) {
    // helper condition for highscore eligibility
    for (var i = 0; i < Object.keys(gHelpersBoolians).length; i++) {
        if (gHelpersBoolians[Object.keys(gHelpersBoolians)[i]]) return
    }

    // variable to check appropriate difficulty level in array
    var difficultyChecker = null
    switch (level.name) {
        case 'easy': difficultyChecker = 0
            break
        case 'intermediate': difficultyChecker = 1
            break
        case 'hard': difficultyChecker = 2
            break
        case 'expert': difficultyChecker = 3
            break
    }

    // current end timer to check
    const highScoreSuspect = gTimer.timerEnd

    // conditions to check if lowest high score exists or if suspect is lower than it
    if ((gHighScoresMat[difficultyChecker][9] === 0) || (highScoreSuspect < gHighScoresMat[difficultyChecker][9])) {

        // sends to placement rearangement function
        handlePlacement(highScoreSuspect, difficultyChecker)

        // renders DOM
        renderScoreBoard()
    }
}

function handlePlacement(newScore, level) {
    // vars to assist ordering
    var currCheck = newScore
    var nextCheck = null

    // loops the appropriate level row in the array
    for (var i = 0; i < 10; i++) {

        // checks if position exists
        if (!gHighScoresMat[level][i]) {
            gHighScoresMat[level][i] = currCheck
            break
        }

        // checks if the new highscore is lower than current
        else if (currCheck < gHighScoresMat[level][i]) {
            nextCheck = gHighScoresMat[level][i]
            gHighScoresMat[level][i] = currCheck
            currCheck = nextCheck
        }
    }

    // updates local storage
    localStorage.setItem("scores", JSON.stringify(gHighScoresMat))
}

function renderScoreBoard() {
    // loops the array
    for (var i = 0; i < 4; i++) {

        for (var j = 0; j < 10; j++) {
            // capture specific DOM element
            const elCurrScore = document.querySelector(`.HS-${i}_${j} span`)

            // converts to readable time if needed
            const legibleTime = (gHighScoresMat[i][j] ? makeTimeLegible(gHighScoresMat[i][j]) : "Hasn't happened yet")

            // updates DOM
            elCurrScore.innerText = legibleTime
        }
    }
}