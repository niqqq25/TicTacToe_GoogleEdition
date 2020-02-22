function victoryLine(symbol, indexArr) {
    const stroke = symbol === "o" ? "#F2EBD3" : "#545454";
    const victoryLineCoords = getVictoryLineCoords(indexArr);
    const { x1, x2, y1, y2 } = victoryLineCoords;
    const lineLength = distBetweenCoords(victoryLineCoords);

    const victoryLine = `<line id="line-svg" stroke=${stroke} x1="${x1}" x2="${x2}" y1="${y1}" y2="${y2}" stroke-dasharray="${lineLength}"/>`;
    const svg = `<svg id="board-svg">${victoryLine}</svg>`;

    return svg;
}

function getVictoryLineCoords(indexArr) {
    const boardSize = parseInt($("#board").css("width"));
    const startIndex = indexArr[0];
    const endIndex = indexArr[2];
    const startCoords = getCoordsFromIndex(startIndex);
    const endCoords = getCoordsFromIndex(endIndex);
    let x1, x2, y1, y2;

    if (startCoords.y === endCoords.y) {
        x1 = 0;
        y1 = coordToPx(startCoords.y);
        x2 = boardSize;
        y2 = coordToPx(endCoords.y);
    } else if (startCoords.x === endCoords.x) {
        x1 = coordToPx(startCoords.x);
        y1 = 0;
        x2 = coordToPx(endCoords.x);
        y2 = boardSize;
    } else {
        //diagonal
        const padding = 5;
        if (startCoords.x === 0 && startCoords.y === 0) {
            x1 = padding;
            y1 = padding;
            x2 = boardSize - padding;
            y2 = boardSize - padding;
        } else {
            x1 = boardSize - padding;
            y1 = padding;
            x2 = padding;
            y2 = boardSize - padding;
        }
    }

    return { x1, x2, y1, y2 };
}

function getCoordsFromIndex(index) {
    const y = Math.floor(index / 3);
    const x = index % 3;
    return { y, x };
}

function coordToPx(index) {
    const boardBoxSize = parseInt($(".board-box").css("width"));
    const boardGapSize = parseInt($("#board").css("row-gap"));
    return boardBoxSize / 2 + (boardBoxSize + boardGapSize) * index;
}

function distBetweenCoords({ x1, x2, y1, y2 }) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

export default victoryLine;
