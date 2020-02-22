function checkForWin(board) {
    let winSymbol = "";
    let winCoords = [];

    for (let i = 0; i < 3; i++) {
        //check rows
        const rowStart = i * 3;
        if (
            board[rowStart] === board[rowStart + 1] &&
            board[rowStart] === board[rowStart + 2] &&
            board[rowStart]
        ) {
            winSymbol = board[rowStart];
            winCoords = [rowStart, rowStart + 1, rowStart + 2];
        }
        //check columns
        if (
            board[i] === board[i + 3] &&
            board[i] === board[i + 6] &&
            board[i]
        ) {
            winSymbol = board[i];
            winCoords = [i, i + 3, i + 6];
        }
    }

    //check diagonals
    if (board[4]) {
        if (board[0] === board[4] && board[4] === board[8]) {
            winSymbol = board[4];
            winCoords = [0, 4, 8];
        }
        if (board[2] === board[4] && board[4] === board[6]) {
            winSymbol = board[4];
            winCoords = [2, 4, 6];
        }
    }

    if (winSymbol) {
        return {
            symbol: winSymbol,
            coords: winCoords
        };
    }

    return 0;
}

export default checkForWin;
