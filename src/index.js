import 'jquery';
import './styles/index.css';

let score_x = 0,
    score_o = 0,
    isPlayerTurn = true,
    isGameRunning = false,
    victoryLine = {},
    playerSymbol = 'x',
    computerSymbol = 'o',
    filledBoardBoxes = 0,
    isTurnEnded = true,
    boardState = [['', '', ''],
                ['', '', ''],
                ['', '', '']];
const $turnBox = $("#turn-box");

(function gameInit(){
    $(document).ready(function(){
        createBoard();
        $("#o-result-field").click(function(){
                swapSymbols();
        });
        $("#restart-button").click(function(){
            if(isTurnEnded){
                restartGame();
            }
        });
    });
})();

async function gameManager(boardBox_div){
    if(isTurnEnded){
        isTurnEnded = false;
        if(isGameRunning && isPlayerTurn){
            await playerActions(boardBox_div);
        }
        if(isGameRunning && !isPlayerTurn){
            await computerActions();
        }
        isTurnEnded = true;
    }
}

async function playerActions(boardBox_div){   
    const boardBoxIndex = boardBox_div.id.slice(-1);
    const boardBoxCoord = indexToCoord(boardBoxIndex);
    if(isBoardBoxEmpty(boardBoxCoord)){
        changeBoardState(boardBoxCoord, playerSymbol);
        fillBoardBoxWithSymbol(boardBoxCoord, playerSymbol);
        changeTurn();
        await waitForLimitedTime(800, async function(){
            if(isWin(boardBoxCoord, boardState)){
                isGameRunning = false;
                drawVictoryLine(playerSymbol);
                increaseScore(playerSymbol);
                updateResults();
                await waitForLimitedTime(800, function(){
                drawVictoryField(playerSymbol);
                });
            }
            else if(isDraw()){
                isGameRunning = false;
                drawDrawField();
            }
        });
    }
}

async function computerActions(){
    const boardBoxCoord = makeComputersMove();
    changeBoardState(boardBoxCoord, computerSymbol);
    fillBoardBoxWithSymbol(boardBoxCoord, computerSymbol);
    changeTurn();
    await waitForLimitedTime(200, async function(){
        if(isWin(boardBoxCoord, boardState)){
            isGameRunning = false;
            drawVictoryLine(computerSymbol);
            increaseScore(computerSymbol);
            updateResults();
            await waitForLimitedTime(800, function(){
                drawVictoryField(computerSymbol);
            });
        }
        else if(isDraw()){
            isGameRunning = false;
            drawDrawField();
        }
    });
}

function restartGame(){
    isGameRunning = false;
    //restart global game variables
    filledBoardBoxes = 0;
    isPlayerTurn = true;
    victoryLine = {};
    isTurnEnded = true;
    //restart board
    resetBoardStates();
    $("#board").remove();
    createBoard();
    //reset result fields
    playerSymbol = 'x';
    computerSymbol = 'o';
    updateResultButtonShading();
    //reset turnbox
    resetTurnBox();
}

function resetBoardStates(){
    for(let row of boardState){
        for(let column in row){
            row[column] = '';
        }
    }
}

function changeTurn(){
    if(isPlayerTurn){
        isPlayerTurn = false;
    }
    else{
        isPlayerTurn = true;
    }
    updateResultButtonShading();
    updateTurnBox();
}

function makeComputersMove(){
    let tempBoard = boardState.map(arr => arr.slice()),
        move;
    const emptyBoxesArray = getEmptyBoxesArray(),
        symbolsArr = [computerSymbol, playerSymbol];
    for(let i = 0; i < symbolsArr.length; i++){ //checks for loose or win condition
        for(let a = 0; a < emptyBoxesArray.length; a++){
            tempBoard[emptyBoxesArray[a].y][emptyBoxesArray[a].x] = symbolsArr[i];
            if(isWin(emptyBoxesArray[a], tempBoard)){
                move = emptyBoxesArray[a];
                return move;
            }
            tempBoard[emptyBoxesArray[a].y][emptyBoxesArray[a].x] = '';
        }
    }
    //choose random movement
    let randomIndex = Math.round(Math.random() * (emptyBoxesArray.length - 1));
    move = emptyBoxesArray[randomIndex];
    return move;
}

function drawVictoryLine(symbol){
    const svgContainer = d3.select("#board").append("svg").attr("id", "board-svg");
    let lineColor = "#545454";

    //set line color
    if(symbol == 'o'){
        lineColor = "#F2EBD3";
    }
    //append line
    svgContainer.append("line")
                    .attr("id", "line-svg")
                    .attr("x1", victoryLine.x1)
                    .attr("y1", victoryLine.y1)
                    .attr("x2", victoryLine.x2)
                    .attr("y2", victoryLine.y2)
                    .attr("stroke", lineColor);  
    setLineAnimation();
}

function setLineAnimation(){
    let lineLength;
    const diffBetweenX = Math.abs(parseFloat(victoryLine.x1) - parseFloat(victoryLine.x2));
    const diffBetweenY = Math.abs(parseFloat(victoryLine.y1) - parseFloat(victoryLine.y2));

    if(diffBetweenX > diffBetweenY){ //row
        lineLength = diffBetweenX;
    }
    else if (diffBetweenX < diffBetweenY){ //column
        lineLength = diffBetweenY;
    }
    else{ //diagonal
        lineLength = distBetweenTwoPoints(diffBetweenX, diffBetweenY);
    }
    $("#line-svg").css("stroke-dasharray", lineLength);
    document.getElementById("line-svg").style.setProperty("--dashoffset-for-line", lineLength);
}

function isWin(coord, board){
    const boardSize = parseInt($("#board").css("width"))
    //check rows
    if(board[coord.y][0] == board[coord.y][1] && board[coord.y][0] == board[coord.y][2]){
        setVictoryLineEndPoints(0, indexToPx(coord.y), boardSize, indexToPx(coord.y));       
        return true;
    }
    //check columns
    if(board[0][coord.x] == board[1][coord.x] && board[0][coord.x] == board[2][coord.x]){
        setVictoryLineEndPoints(indexToPx(coord.x), 0, indexToPx(coord.x), boardSize); 
        return true;
    }
    //check first diagonal
    if(board[0][0] == board[1][1] && board[0][0] == board[2][2] && board[0][0] == board[coord.y][coord.x]){
        setVictoryLineEndPoints(5, 5, boardSize - 5, boardSize - 5); 
        return true;
    }
    //check second diagonal
    if(board[0][2] == board[1][1] && board[0][2] == board[2][0] && board[0][2] == board[coord.y][coord.x]){
        setVictoryLineEndPoints(boardSize - 5, 5, 5, boardSize - 5); 
        return true;
    }
    return false;
}

function indexToPx(index){
    const boardBoxSize = parseInt($("#board-box1").css("width"));
    const boardGapSize = parseInt($("#board").css("row-gap"));
    return (boardBoxSize / 2) + (boardBoxSize + boardGapSize) * index;
}

function isDraw(){
    return filledBoardBoxes == 9;
}

function distBetweenTwoPoints(point1, point2){
    return Math.sqrt(Math.pow(point1, 2) + Math.pow(point2, 2));
}

function setVictoryLineEndPoints(x1, y1, x2, y2){
    victoryLine.x1 = x1;
    victoryLine.y1 = y1;
    victoryLine.x2 = x2;
    victoryLine.y2 = y2;
}

function waitForLimitedTime(time, foo){
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(foo());
      },time);
    });
  }

function fillBoardBoxWithSymbol(coord, symbol){
    const boxIndex = coord.y * 3 + coord.x;
    let boardBox = d3.select(document.getElementsByClassName("board-box")[boxIndex]);
    //add svg element
    let svgContainer = boardBox.append("svg").attr("class", "svg-inside-box").attr("viewBox", "0 0 100 100");
    //add symbol
    if(symbol == 'x'){
        svgContainer.append("path").attr("class", "x").attr("d", "M20 20 l60 60 M80 20 l-60 60");
    }
    else{
        svgContainer.append("circle").attr("class", "o").attr("cx", 50).attr("cy", 50).attr("r", 30);
    }
    filledBoardBoxes++;
}

function indexToCoord(index){
    const row = Math.floor(index / 3);
    const column = index - row * 3;
    return {y: row, x: column};
}

function changeBoardState(coord, newState){
    boardState[coord.y][coord.x] = newState;
}

function isBoardBoxEmpty(coord){
    return boardState[coord.y][coord.x] == '';
}

function increaseScore(symbol){
    if(symbol == 'x'){
        score_x++;
    }
    else{
        score_o++;
    }
}

function updateResults(){
    $("#x-result").text(score_x);
    $("#o-result").text(score_o);
}

function swapSymbols(){
    if(filledBoardBoxes == 0){
        playerSymbol = 'o';
        computerSymbol = 'x';
        isPlayerTurn = false;
        computerActions();
    }
}

function getEmptyBoxesArray(){
    let emptyBoxCoords = [];
    for(let row = 0; row < 3; row++){
        for(let column = 0; column < 3; column++){
            if(boardState[row][column] == ''){
                emptyBoxCoords.push({x: column, y: row});
            }
        }
    }
    return emptyBoxCoords;
}

function updateResultButtonShading(){
    if(isPlayerTurn){
        $("#" + computerSymbol + "-result-field").removeClass("selected-result-button");
        $("#" + playerSymbol + "-result-field").addClass("selected-result-button");
    }
    else{
        $("#" + playerSymbol + "-result-field").removeClass("selected-result-button");
        $("#" + computerSymbol + "-result-field").addClass("selected-result-button");
    }
}

function resetTurnBox(){
    $turnBox.text("Start game or select symbol");
}

function updateTurnBox(){
    if(isGameRunning){
        if(isPlayerTurn){
            $turnBox.text("Your turn");
        }
        else{
            $turnBox.text("Computer's turn");
        }
    }
    else{
        $turnBox.text("Game Over");
    }
}

function createVictoryOrDrawField(){
    const $victoryOrDrawField = $("<div />", {"id": "victory-or-draw-field"});
    $("#board").append($victoryOrDrawField);
    //add event listener
    $("#victory-or-draw-field").click(function(){
        restartGame();
    });
}

function drawDrawField(){
    updateTurnBox();
    createVictoryOrDrawField();
    //update first upper box
    const $victoryOrDrawFieldsUpperBox1 = d3.select(document.getElementById("victory-or-draw-field")).append("svg")
                                    .attr("class", "victory-or-draw-field-upper-box").attr("viewBox", "0 0 100 100");
    $victoryOrDrawFieldsUpperBox1.append("path").attr("class", "x").attr("d", "M20 20 l60 60 M80 20 l-60 60").style("animation", "none");
    //update second upper box
    const $victoryOrDrawFieldsUpperBox2 = d3.select(document.getElementById("victory-or-draw-field")).append("svg")
                                    .attr("class", "victory-or-draw-field-upper-box").attr("viewBox", "0 0 100 100");
    $victoryOrDrawFieldsUpperBox2.append("circle").attr("class", "o").attr("cx", 50).attr("cy", 50).attr("r", 30).style("animation", "none");
    $(".victory-or-draw-field-upper-box").css({"display" : "inline-block"});
    //update lower box
    const $victoryOrDrawFieldsLowerBox = $("<div />", {"id": "victory-or-draw-field-lower-box"});
    $("#victory-or-draw-field").append($victoryOrDrawFieldsLowerBox);
    $victoryOrDrawFieldsLowerBox.text("DRAW!");
}

function drawVictoryField(symbol){
    updateTurnBox();
    createVictoryOrDrawField();
    //update upper box
    const $victoryOrDrawFieldsUpperBox = d3.select(document.getElementById("victory-or-draw-field")).append("svg")
    .attr("class", "victory-or-draw-field-upper-box").attr("viewBox", "0 0 100 100");
    if(symbol == 'x'){
        $victoryOrDrawFieldsUpperBox.append("path").attr("class", "x").attr("d", "M20 20 l60 60 M80 20 l-60 60").style("animation", "none");
    }
    else{
        $victoryOrDrawFieldsUpperBox.append("circle").attr("class", "o").attr("cx", 50).attr("cy", 50).attr("r", 30).style("animation", "none");
    }
    //update lower box
    const $victoryOrDrawFieldsLowerBox = $("<div/>").attr("id", "victory-or-draw-field-lower-box");
    $("#victory-or-draw-field").append($victoryOrDrawFieldsLowerBox);
    $victoryOrDrawFieldsLowerBox.text("WINNER!");
}

function createBoard(){
    const $board = $("<div />", {"id": "board"});
    const $boardBackground = $("<div />", {"id": "board-background"});
    let $boardBox = $("<div />", {"class": "board-box"});
    //add background
    $boardBackground.appendTo($board);
    //add cells
    for(let i = 0; i < 9; i++){
        $boardBox.clone().attr("id", "board-box" + i).appendTo($board);
    }
    $board.appendTo($("#outer-board-field"));

    waitForLimitedTime(1000, function(){ //wait for box appear animation to end
        isGameRunning = true;
    });

    //bind event listener
    $(".board-box").click(function(){
        gameManager(this);
    });
}