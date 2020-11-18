(function() {
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
    let gameOver = false;
    let activateNextRndBtn = false;
    let compPlaysNow = false;

    gameCells.forEach(i => i.addEventListener("click", insertPlayersMark));
    newGameBtn.addEventListener("click", startNewGame);
    nextRoundBtn.addEventListener("click", startNextRound);
    openSettingsModalBtn.addEventListener("click", () => settingsModalBg.style.display = "block");
    window.addEventListener("click", closeSettingsModalBox);
    selectablePlayerX.addEventListener("change", displayRequiredPlayerXSettings);
    selectablePlayerO.addEventListener("change", displayRequiredPlayerOSettings);
    soundBtn.addEventListener("click", toggleSoundIcon);

    function insertPlayersMark() {
        if (!this.innerText && !gameOver) {
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
            changeNextMark();
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
        console.log("Computer's code activated!")
        if (compPlaysNow && (playerXBoardLabel.innerText === "Computer" || playerOBoardLabel.innerText === "Computer")) {
            let emptyCells = [];
            gameCells.forEach(i => {
                if (i.innerText === "") {
                    emptyCells.push(i);
                }
            })
            const cellNumToPlayOn = Math.floor(Math.random() * emptyCells.length);
            emptyCells[cellNumToPlayOn].innerText = nextMark;
            compPlaysNow = false;
            checkCellsEquality();
        }

        if (!gameOver) {
            changeNextMark();
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
                    if (soundOn) {document.getElementById("lost").play();}
                    gameOver = true;
                    rowsColsAndDiags[rowsColsAndDiagsKeys[i]].forEach(i => i.style.color = "green");
                    mainCongratText.innerText = "Sorry, You lost this round";
                    mainCongratText.style.color = "#922724";
                } else {
                    if (soundOn) {document.getElementById("winner").play();}
                    gameOver = true;
                    rowsColsAndDiags[rowsColsAndDiagsKeys[i]].forEach(i => i.style.color = "green");
                    mainCongratText.innerText = `Congratulations ${players[cellValues[cellValuesKeys[i]][0]].name()}`;
                    secCongratText.innerText = `You are the winner`;
                }
            }
        }

        if (Array.from(gameCells).every(i => i.innerText) && !gameOver) {
            gameOver = true;
            activateNextRndBtn = true;
            if (soundOn) {document.getElementById("deadlock").play();}
            playerXBoardLabel.classList.remove("active-player");
            playerOBoardLabel.classList.remove("active-player");
            mainCongratText.innerText = "It's a tie!!";
        }
    }

    function startNewGame() {
        nextMark = "X";
        activateNextRndBtn = true;
        startNextRound();
        players.X.score = 0;
        players.O.score = 0;
        xScore.innerText = 0;
        oScore.innerText = 0;
        if (players.X.name() === "Computer") {
            compPlaysNow = true;
            insertCompMark();
        }
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
            if (nextMark === "X") {
                playerXBoardLabel.classList.add("active-player");
                playerOBoardLabel.classList.remove("active-player");
            } else {
                playerOBoardLabel.classList.add("active-player");
                playerXBoardLabel.classList.remove("active-player");
            }
            if (players[nextMark].name() === "Computer") {
                compPlaysNow = true;
                insertCompMark();
            }
        }
    }

    function closeSettingsModalBox(objClicked) {
        if (objClicked.target === settingsModalBg || objClicked.target === closeSettingsModalIcon) {
            settingsModalBg.style.display = "none";
            playerXBoardLabel.innerText = players.X.name();
            playerOBoardLabel.innerText = players.O.name();
            if (players.X.name() === "Computer") {
                compPlaysNow = true;
                insertCompMark();
            }
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
})();