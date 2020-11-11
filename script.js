const gameCells = document.querySelectorAll(".cell");
const rowOne = document.querySelectorAll(".r1");
const rowTwo = document.querySelectorAll(".r2");
const rowThree = document.querySelectorAll(".r3");
const columnOne = document.querySelectorAll(".c1");
const columnTwo = document.querySelectorAll(".c2");
const columnThree = document.querySelectorAll(".c3");
const diagonalOne = document.querySelectorAll(".d1");
const diagonalTwo = document.querySelectorAll(".d2");

let nextPlay = "X";

gameCells.forEach(i => i.addEventListener("click", insertPlayersPiece));

function insertPlayersPiece() {
    if (!this.innerText) {
        this.innerText = nextPlay;
        changeNextPlay();
        checkCellsEquality();
    }
}

function changeNextPlay() {
    if (nextPlay === "X") {
        nextPlay = "O";
    } else if (nextPlay === "O") {
        nextPlay = "X";
    }
}

function checkCellsEquality() {
    const rowOneCellsValues = [];
    const rowTwoCellsValues = [];
    const rowThreeCellsValues = [];
    const columnOneCellsValues = [];
    const columnTwoCellsValues = [];
    const columnThreeCellsValues = [];
    const diagonalOneCellsValues = [];
    const diagonalTwoCellsValues = [];

    rowOne.forEach(i => rowOneCellsValues.push(i.innerText));
    rowTwo.forEach(i => rowTwoCellsValues.push(i.innerText));
    rowThree.forEach(i => rowThreeCellsValues.push(i.innerText));
    columnOne.forEach(i => columnOneCellsValues.push(i.innerText));
    columnTwo.forEach(i => columnTwoCellsValues.push(i.innerText));
    columnThree.forEach(i => columnThreeCellsValues.push(i.innerText));
    diagonalOne.forEach(i => diagonalOneCellsValues.push(i.innerText));
    diagonalTwo.forEach(i => diagonalTwoCellsValues.push(i.innerText));

    if (rowOneCellsValues.every(i => i === rowOneCellsValues[0] && i !== "")) {
        console.log(rowOneCellsValues);
    }

    if (rowTwoCellsValues.every(i => i === rowTwoCellsValues[0] && i !== "")) {
        console.log(rowTwoCellsValues);
    }

    if (rowThreeCellsValues.every(i => i === rowThreeCellsValues[0] && i !== "")) {
        console.log(rowThreeCellsValues);
    }

    if (columnOneCellsValues.every(i => i === columnOneCellsValues[0] && i !== "")) {
        console.log(columnOneCellsValues);
    }

    if (columnTwoCellsValues.every(i => i === columnTwoCellsValues[0] && i !== "")) {
        console.log(columnTwoCellsValues);
    }

    if (columnThreeCellsValues.every(i => i === columnThreeCellsValues[0] && i !== "")) {
        console.log(columnThreeCellsValues);
    }

    if (diagonalOneCellsValues.every(i => i === diagonalOneCellsValues[0] && i !== "")) {
        console.log(diagonalOneCellsValues);
    }

    if (diagonalTwoCellsValues.every(i => i === diagonalTwoCellsValues[0] && i !== "")) {
        console.log(diagonalTwoCellsValues);
    }
}