import "jquery";
import "./styles/index.css";

import checkForWin from "./shared/checkForWin";

//algorithms
import randomAlgorithm from "./algorithms/random";
import normalAlgorithm from "./algorithms/normal";
import minmaxAlgorithm from "./algorithms/minmax";

//components
import getVictoryLine from "./components/victoryLine";
import getVictoryScreen from "./components/victoryScreen";
import getDrawScreen from "./components/drawScreen";

const SYMBOL_ANIMATION_TIME = 800;
const COMPUTER_DELAY = 200;

let score_x = 0,
    score_o = 0,
    isPlayerTurn,
    isGameRunning,
    playerSymbol = "x",
    computerSymbol = "o",
    board,
    algorithm;
const $turnBox = $("#turn-box");

$(document).ready(function() {
    setGameVariablesToDefault();
    createBoard();
    $("#o-result-field").click(swapSymbols);
    $("#restart-button").click(restartGame);

    //set algorithm
    const $algorithms = $("#algorithms");
    algorithm = $algorithms.val();
    $("#algorithms").change(() => {
        algorithm = $algorithms.val();
        restartGame();
    });
});

async function playerActions(index) {
    if (isBoardIndexEmpty(index) && isPlayerTurn) {
        makeMove(index, playerSymbol);
        await waitForLimitedTime(SYMBOL_ANIMATION_TIME, () => {
            if (isGameEnd()) {
                onGameEnd();
            } else {
                computerActions();
            }
        });
    }
}

async function computerActions() {
    const index = getComputerMove();
    makeMove(index, computerSymbol);

    await waitForLimitedTime(COMPUTER_DELAY, async () => {
        if (isGameEnd()) {
            onGameEnd();
        }
    });
}

function isBoardIndexEmpty(index) {
    return !board[index];
}

function makeMove(index, symbol) {
    board[index] = symbol;
    renderSymbol(index, symbol);
    changeTurn();
}

function isDraw() {
    return !checkForWin(board) && board.every(cell => cell);
}

function isGameEnd() {
    if (checkForWin(board)) {
        return true;
    } else if (isDraw()) {
        return true;
    } else return false;
}

function onGameEnd() {
    const win = checkForWin(board);
    if (win) {
        onWin(win);
    } else {
        onDraw();
    }
    updateTurnBox();
}

function setGameVariablesToDefault() {
    isGameRunning = false;
    isPlayerTurn = true;
    board = new Array(9).fill("");
}

function getComputerMove() {
    switch (algorithm) {
        case "random":
            return randomAlgorithm(board);
        case "normal":
            return normalAlgorithm(board, {
                computer: computerSymbol,
                player: playerSymbol
            });
        case "minmax":
            return minmaxAlgorithm(board, {
                computer: computerSymbol,
                player: playerSymbol
            });
    }
}

async function onWin({ symbol, coords }) {
    isGameRunning = false;
    increaseScore(symbol);
    renderVictoryLine(symbol, coords);

    await waitForLimitedTime(800, function() {
        renderVictoryScreen(symbol);
    });
}

function onDraw() {
    isGameRunning = false;
    renderDrawScreen();
}

function restartGame() {
    setGameVariablesToDefault();
    $("#board").remove();
    createBoard();
    //reset result fields
    playerSymbol = "x";
    computerSymbol = "o";
    updateResultButtonShading();
    //reset turnbox
    resetTurnBox();
}

function changeTurn() {
    if (isPlayerTurn) {
        isPlayerTurn = false;
    } else {
        isPlayerTurn = true;
    }
    updateResultButtonShading();
    updateTurnBox();
}

function renderVictoryLine(symbol, coords) {
    const $board = d3.select("#board");
    const $victoryLine = getVictoryLine(symbol, coords);

    $board.appendHTML($victoryLine);
}

function increaseScore(symbol) {
    if (symbol == "x") {
        score_x++;
    } else {
        score_o++;
    }
    updateResults();
}

function updateResults() {
    $("#x-result").text(score_x);
    $("#o-result").text(score_o);
}

function swapSymbols() {
    if (isBoardEmpty()) {
        playerSymbol = "o";
        computerSymbol = "x";
        isPlayerTurn = false;
        computerActions();
    }
}

function isBoardEmpty() {
    return board.every(cell => !cell);
}

function updateResultButtonShading() {
    if (isPlayerTurn) {
        $("#" + computerSymbol + "-result-field").removeClass(
            "selected-result-button"
        );
        $("#" + playerSymbol + "-result-field").addClass(
            "selected-result-button"
        );
    } else {
        $("#" + playerSymbol + "-result-field").removeClass(
            "selected-result-button"
        );
        $("#" + computerSymbol + "-result-field").addClass(
            "selected-result-button"
        );
    }
}

function resetTurnBox() {
    $turnBox.text("Start game or select symbol");
}

function updateTurnBox() {
    if (isGameRunning) {
        if (isPlayerTurn) {
            $turnBox.text("Your turn");
        } else {
            $turnBox.text("Computer's turn");
        }
    } else {
        $turnBox.text("Game Over");
    }
}

function renderDrawScreen() {
    const $board = d3.select("#board");
    const $drawScreen = getDrawScreen();

    $board.html($drawScreen);
    $("#draw-screen").click(restartGame);
}

function renderVictoryScreen(symbol) {
    const $board = d3.select("#board");
    const $victoryScreen = getVictoryScreen(symbol, restartGame);

    $board.html($victoryScreen);
    $("#victory-screen").click(restartGame);
}

function renderSymbol(index, symbol) {
    const $boardBox = d3.select(
        document.getElementsByClassName("board-box")[index]
    );

    const $circle = '<circle cx="50" cy="50" r="30" class="circle" />';

    const $cross = '<path d="M20 20 l60 60 M80 20 l-60 60" class="cross" />';

    const $symbol = `<svg class="svg-inside-box" viewBox="0 0 100 100">${
        symbol === "x" ? $cross : $circle
    }<svg/>`;

    $boardBox.html($symbol);
}

function createBoard() {
    const $board = $("<div />", { id: "board" });
    const $boardBackground = $("<div />", { id: "board-background" });
    let $boardBox = $("<div />", { class: "board-box" });
    //add background
    $boardBackground.appendTo($board);
    //add cells
    for (let i = 0; i < 9; i++) {
        $boardBox
            .clone()
            .appendTo($board)
            .click(() => playerActions(i));
    }
    $board.appendTo($("#outer-board-field"));

    waitForLimitedTime(1000, function() {
        //wait for box appearance animation to end
        isGameRunning = true;
    });
}

d3.selection.prototype.appendHTML = function(HTMLString) {
    return this.select(function() {
        return this.appendChild(
            document.importNode(
                new DOMParser().parseFromString(HTMLString, "text/html").body
                    .childNodes[0],
                true
            )
        );
    });
};

function waitForLimitedTime(time, foo) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(foo());
        }, time);
    });
}
