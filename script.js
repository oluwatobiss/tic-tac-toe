// (function() {
    const openSettingsModalBtn = document.getElementById("open-settings-modal");
    const closeSettingsModalIcon = document.querySelector(".fa-times-circle");
    const settingsModalBg = document.getElementById("settings-modal-bg");
    const selectablePlayerX = document.getElementById("selectable-player-x");
    const xHumanOption = document.getElementById("x-hum-opt");
    const xComputerOption = document.getElementById("x-comp-opt");
    const compXdiffLevel = document.getElementById("comp-x-diff-level");
    const playerXName = document.getElementById("pl-x-name");
    const selectablePlayerO = document.getElementById("selectable-player-o");
    const oHumanOption = document.getElementById("o-hum-opt");
    const oComputerOption = document.getElementById("o-comp-opt");
    const compOdiffLevel = document.getElementById("comp-o-diff-level");
    const playerOName = document.getElementById("pl-o-name");
    const soundBtn = document.querySelector(".sound");
    const soundIcon = document.querySelector(".fa-volume-up");
    const gameCells = document.querySelectorAll(".cell");
    const xScore = document.getElementById("x-score");
    const oScore = document.getElementById("o-score");
    const playerXBoardLabel = document.getElementById("player-x-board-label");
    const playerOBoardLabel = document.getElementById("player-o-board-label");
    const mainCongratText = document.getElementById("main-congrat-text");
    const secCongratText = document.getElementById("sec-congrat-text");
    const newGameBtn = document.getElementById("new-game-btn");
    const nextRoundBtn = document.getElementById("next-round-btn");
    const leftArrow = document.querySelector(".fa-caret-left");
    const rightArrow = document.querySelector(".fa-caret-right");
    const players = {
        X: {
            score: 0,
            name() {
                if (selectablePlayerX.value === "Human") {
                    return playerXName.value || "Player X";
                } else {
                    return "Computer";
                }
            },
            showUpdatedScore() {
                xScore.innerText = this.score;
                leftArrow.style.visibility = "visible";
            }
        },
        O: {
            score: 0,
            name() {
                if (selectablePlayerO.value === "Human") {
                    return playerOName.value || "Player O";
                } else {
                    return "Computer";
                }
            },
            showUpdatedScore() {
                oScore.innerText = this.score;
                rightArrow.style.visibility = "visible";
            }
        }
    };

    let nextMark = "X";
    let soundOn = true;
    let gameStarted = false;
    let gameOver = false;
    let activateNextRndBtn = false;
    let compPlaysNow = false;

    gameCells.forEach(c => c.addEventListener("click", insertPlayersMark));
    newGameBtn.addEventListener("click", startNewGame);
    nextRoundBtn.addEventListener("click", startNextRound);
    openSettingsModalBtn.addEventListener("click", openSettings);
    window.addEventListener("click", closeSettingsModalBox);
    selectablePlayerX.addEventListener("change", displayRequiredPlayerXSettings);
    selectablePlayerO.addEventListener("change", displayRequiredPlayerOSettings);
    soundBtn.addEventListener("click", toggleSoundIcon);

    function insertPlayersMark() {
        if (!this.innerText && !gameOver) {
            gameStarted = true;
            if (soundOn) {
                if (nextMark === "X") {
                    document.getElementById("x-played").play();
                } else {
                    document.getElementById("o-played").play();
                }
            }
            this.innerText = nextMark;
            checkCellsEquality();
        }

        if (!gameOver) {
            console.log("Game not over");
            if (playerXBoardLabel.innerText !== "Computer" && playerOBoardLabel.innerText !== "Computer") {
                changeNextMark();
            }
            if (playerXBoardLabel.innerText === "Computer" || playerOBoardLabel.innerText === "Computer") {
                compPlaysNow = true;
                insertCompMark();
                compPlaysNow = false;
            }
        } else {
            console.log("Game is over!!!!");
        }
    }

    function insertCompMark() {
        if (
            players.X.name() === "Computer" && compXdiffLevel.value === "Easy" ||
            players.O.name() === "Computer" && compOdiffLevel.value === "Easy"
            ) {
            console.log("Computer is playing easy");
            insertEasyCompMark();
        } else if (
            players.X.name() === "Computer" && compXdiffLevel.value === "Medium" ||
            players.O.name() === "Computer" && compOdiffLevel.value === "Medium"
        ) {
            console.log("Computer playing averagely...")
            const randomNumber = Math.random();
            console.log(`Random number = ${randomNumber}`);
            if (randomNumber > 0.25) {
                console.log("Average called HARD!");
                insertHardCompMark();
            } else {
                console.log("Average called easy!");
                insertEasyCompMark();
            }
        } else {
            console.log("Computer is playing very hard");
            insertHardCompMark();
        }
    }

    function insertEasyCompMark() {
        console.log("Computer's code activated!");

        gameStarted = true;
        let compMark = "";

        if (players.X.name() === "Computer") {
            compMark = "X";
        } else if (players.O.name() === "Computer") {
            compMark = "O";
        }

        if (compPlaysNow && (playerXBoardLabel.innerText === "Computer" || playerOBoardLabel.innerText === "Computer")) {
            const emptyCells = [];
            gameCells.forEach(c => {
                if (c.innerText === "") {
                    emptyCells.push(c);
                }
            })
            const cellNumToPlayOn = Math.floor(Math.random() * emptyCells.length);
            emptyCells[cellNumToPlayOn].innerText = compMark;
            compPlaysNow = false;
            checkCellsEquality();
        }
    }

    function insertHardCompMark() {
        if (compPlaysNow && (playerXBoardLabel.innerText === "Computer" || playerOBoardLabel.innerText === "Computer")) {
            gameStarted = true;
            let aiMark = "";
            let humanMark = "";

            if (players.X.name() === "Computer") {
                aiMark = "X";
                humanMark = "O";
            } else if (players.O.name() === "Computer") {
                aiMark = "O";
                humanMark = "X";
            }
            
            const currentBoardState = [];
            gameCells.forEach((c, i) => {
                if (c.innerText) {
                    currentBoardState.push(c.innerText);
                } else {
                    currentBoardState.push(i);
                }
            });

            console.log(currentBoardState);

            const bestCellNumToPlayOn = minimax(currentBoardState, aiMark);
            console.log(bestCellNumToPlayOn);
            console.log(bestCellNumToPlayOn.index);
            gameCells[bestCellNumToPlayOn.index].innerText = aiMark;
            compPlaysNow = false;
            checkCellsEquality();

            function minimax(currBdSt, currMark) {
                const availCellsIndexes = getAllEmptyCellsIndexes(currBdSt);
            
                // Check if a terminal state (i.e., win, lose, or tie) is found. If so, return the appropriate score:
                if (checkIfWinnerFound(currBdSt, humanMark)) {
                    return {score: -1};
                } else if (checkIfWinnerFound(currBdSt, aiMark)) {
                    return {score: 1};
                } else if (availCellsIndexes.length === 0) {
                    return {score: 0};
                }
                
                /** 
                 If no terminal state is found, test the outcome of playing the current mark (currMark) on each of the
                current board's empty cells. Then, record your findings in an array.
                */

                // Create array to store all analysis of each test gameplay:
                const allTestPlayInfos = [];
            
                // Loop through each of the empty cells starting from the first empty cell:
                for (let i = 0; i < availCellsIndexes.length; i++) {
                    const currentTestPlayInfo = {};

                    // Save the index number of the empty cell currently being processed:
                    currentTestPlayInfo.index = currBdSt[availCellsIndexes[i]];
            
                    // Temporarily set the empty cell currently being processed to the current player's mark:
                    currBdSt[availCellsIndexes[i]] = currMark;
                    
                    // Then recursively run the minimax function on the new current board and save the returned score
                    //when a terminal state is found:
                    if (currMark === aiMark) {
                        const result = minimax(currBdSt, humanMark);
                        currentTestPlayInfo.score = result.score;
                    } else {
                        const result = minimax(currBdSt, aiMark);
                        currentTestPlayInfo.score = result.score;
                    }
                    
                    // Reset the current empty cell being processed back to its index number:
                    currBdSt[availCellsIndexes[i]] = currentTestPlayInfo.index;
            
                    // Save the details of this trial play to the allTestPlayInfos array:
                    allTestPlayInfos.push(currentTestPlayInfo);
                }

                /** 
                 Evaluate each score in the allTestPlayInfos array to choose the trial play that is the 
                best/winning game play.
                */
                let bestTestPlay = null;
                if (currMark === aiMark) {
                    let bestScore = -Infinity;
                    for (let i = 0; i < allTestPlayInfos.length; i++) {
                        if (allTestPlayInfos[i].score > bestScore) {
                            bestScore = allTestPlayInfos[i].score;
                            bestTestPlay = i;
                        }
                    }
                } else {
                    let bestScore = Infinity;
                    for (let i = 0; i < allTestPlayInfos.length; i++) {
                        if (allTestPlayInfos[i].score < bestScore) {
                            bestScore = allTestPlayInfos[i].score;
                            bestTestPlay = i;
                        }
                    }
                }
                
                // Retrieve the bestScore's object from the allTestPlayInfos array and make it the return
                // value of this minimax function:
                return allTestPlayInfos[bestTestPlay];
            }

            function getAllEmptyCellsIndexes(currBdSt) {
                return currBdSt.filter(v => v != "O" && v != "X");
            }

            function checkIfWinnerFound(currBdSt, currMark) {
                if (
                    (currBdSt[0] === currMark && currBdSt[1] === currMark && currBdSt[2] === currMark) ||
                    (currBdSt[3] === currMark && currBdSt[4] === currMark && currBdSt[5] === currMark) ||
                    (currBdSt[6] === currMark && currBdSt[7] === currMark && currBdSt[8] === currMark) ||
                    (currBdSt[0] === currMark && currBdSt[3] === currMark && currBdSt[6] === currMark) ||
                    (currBdSt[1] === currMark && currBdSt[4] === currMark && currBdSt[7] === currMark) ||
                    (currBdSt[2] === currMark && currBdSt[5] === currMark && currBdSt[8] === currMark) ||
                    (currBdSt[0] === currMark && currBdSt[4] === currMark && currBdSt[8] === currMark) ||
                    (currBdSt[2] === currMark && currBdSt[4] === currMark && currBdSt[6] === currMark)
                    ) {
                        return true;
                    } else {
                        return false;
                    }
            }
        }
    }

    function changeNextMark() {
        playerXBoardLabel.classList.toggle("active-player");
        playerOBoardLabel.classList.toggle("active-player");
        if (nextMark === "X") {
            nextMark = "O";
        } else if (nextMark === "O") {
            nextMark = "X";
        }
        console.log(nextMark);
    }

    function checkCellsEquality() {
        const rowsColsAndDiagsKeys = ["rowOne", "rowTwo", "rowThree", "columnOne",
        "columnTwo", "columnThree", "diagonalOne", "diagonalTwo"];

        const rowsColsAndDiags = {
            rowOne: document.querySelectorAll(".r1"),
            rowTwo: document.querySelectorAll(".r2"),
            rowThree: document.querySelectorAll(".r3"),
            columnOne: document.querySelectorAll(".c1"),
            columnTwo: document.querySelectorAll(".c2"),
            columnThree: document.querySelectorAll(".c3"),
            diagonalOne: document.querySelectorAll(".d1"),
            diagonalTwo: document.querySelectorAll(".d2")
        }

        const cellValuesKeys = ["rowOneCellsValues", "rowTwoCellsValues", "rowThreeCellsValues", "columnOneCellsValues", 
        "columnTwoCellsValues", "columnThreeCellsValues", "diagonalOneCellsValues", "diagonalTwoCellsValues"];

        const cellValues = {
            rowOneCellsValues: [],
            rowTwoCellsValues: [],
            rowThreeCellsValues: [],
            columnOneCellsValues: [],
            columnTwoCellsValues: [],
            columnThreeCellsValues: [],
            diagonalOneCellsValues: [],
            diagonalTwoCellsValues: []
        }

        for (let i = 0; i < rowsColsAndDiagsKeys.length; i++) {
            rowsColsAndDiags[rowsColsAndDiagsKeys[i]].forEach(c => cellValues[cellValuesKeys[i]].push(c.innerText));
        }

        for (let i = 0; i < cellValuesKeys.length; i++) {
            if (cellValues[cellValuesKeys[i]].every(v => v === cellValues[cellValuesKeys[i]][0] && v !== "")) {
                playerXBoardLabel.classList.remove("active-player");
                playerOBoardLabel.classList.remove("active-player");
                players[cellValues[cellValuesKeys[i]][0]].score++;
                players[cellValues[cellValuesKeys[i]][0]].showUpdatedScore();
                if (players[cellValues[cellValuesKeys[i]][0]].name() === "Computer") {
                    gameOver = true;
                    gameStarted = false;
                    if (soundOn) {document.getElementById("lost").play();}
                    rowsColsAndDiags[rowsColsAndDiagsKeys[i]].forEach(i => i.style.color = "green");
                    mainCongratText.innerText = "Sorry, You lost this round";
                    mainCongratText.style.color = "#922724";
                } else {
                    gameOver = true;
                    gameStarted = false;
                    if (soundOn) {document.getElementById("winner").play();}
                    rowsColsAndDiags[rowsColsAndDiagsKeys[i]].forEach(i => i.style.color = "green");
                    mainCongratText.innerText = `Congratulations ${players[cellValues[cellValuesKeys[i]][0]].name()}`;
                    secCongratText.innerText = `You are the winner`;
                }
            }
        }

        if (Array.from(gameCells).every(i => i.innerText) && !gameOver) {
            gameOver = true;
            gameStarted = false;
            activateNextRndBtn = true;
            if (soundOn) {document.getElementById("deadlock").play();}
            playerXBoardLabel.classList.remove("active-player");
            playerOBoardLabel.classList.remove("active-player");
            mainCongratText.innerText = "It's a tie!!";
        }
    }

    function startNewGame() {
        nextMark = "X";
        gameStarted = false;
        activateNextRndBtn = true;
        startNextRound();
        players.X.score = 0;
        players.O.score = 0;
        xScore.innerText = 0;
        oScore.innerText = 0;
    }

    function startNextRound() {
        console.log(nextMark);
        if (gameOver || activateNextRndBtn) {
            gameOver = false;
            activateNextRndBtn = false;
            mainCongratText.innerText = "";
            mainCongratText.style.color = "";
            secCongratText.innerText = "";
            leftArrow.style.visibility = "hidden";
            rightArrow.style.visibility = "hidden";
            gameCells.forEach(i => {
                i.innerText = "";
                i.style.color = "#4b3621";
            });
            if (players.X.name() === "Computer") {
                compPlaysNow = true;
                insertCompMark();
                nextMark = "O";
            } else {
                nextMark = "X";
            }
            if (nextMark === "X") {
                playerXBoardLabel.classList.add("active-player");
                playerOBoardLabel.classList.remove("active-player");
            } else {
                playerOBoardLabel.classList.add("active-player");
                playerXBoardLabel.classList.remove("active-player");
            }
        }
    }

    function openSettings() {
        if (!gameStarted) {
            settingsModalBg.style.display = "block";
        } else {
            alert("Sorry, you can't change the settings while the game is on. Please finish this round first.");
        }
    }

    function closeSettingsModalBox(objClicked) {
        if (objClicked.target === settingsModalBg || objClicked.target === closeSettingsModalIcon) {
            settingsModalBg.style.display = "none";
            playerXBoardLabel.innerText = players.X.name();
            playerOBoardLabel.innerText = players.O.name();
            activateNextRndBtn = true;
            startNextRound();
        }
    }

    function displayRequiredPlayerXSettings() {
        if (selectablePlayerX.value === "Human") {
            playerXName.style.display = "block";
            compXdiffLevel.style.display = "none";
            oComputerOption.removeAttribute("disabled");
        } else if (selectablePlayerX.value === "Computer") {
            compXdiffLevel.style.display = "block";
            playerXName.style.display = "none";
            oHumanOption.selected = true;
            oComputerOption.disabled = true;
            playerOName.style.display = "block";
            compOdiffLevel.style.display = "none";
            oComputerOption.removeAttribute("selected");
        }
    }

    function displayRequiredPlayerOSettings() {
        if (selectablePlayerO.value === "Human") {
            playerOName.style.display = "block";
            compOdiffLevel.style.display = "none";
            xComputerOption.removeAttribute("disabled");
        } else if (selectablePlayerO.value === "Computer") {
            compOdiffLevel.style.display = "block";
            playerOName.style.display = "none";
            xHumanOption.selected = true;
            xComputerOption.disabled = true;
            playerXName.style.display = "block";
            compXdiffLevel.style.display = "none";
            xComputerOption.removeAttribute("selected");
        }
    }

    function toggleSoundIcon() {
        const classes = soundIcon.classList;
        soundOn = classes.toggle("fa-volume-up");
        classes.toggle("fa-volume-mute");
        soundBtn.classList.toggle("sound-on");
        soundBtn.classList.toggle("sound-off");
    }
// })();