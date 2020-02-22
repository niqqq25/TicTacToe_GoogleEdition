
import getEmptyIndexes from "../shared/getEmptyIndexes";
import checkForWin from "../shared/checkForWin";

function minmaxAlgorithm(board, symbols) {
    const emptyIndexes = getEmptyIndexes(board);

    return minmax(emptyIndexes, board, true, symbols, 0);
}

function minmax(nodes, board, isMax, symbols, depth = 1) {
    //check for win
    const isWin = checkForWin(board);
    if (isWin) {
        return !isMax ? 1 : -1;
    }

    //check for draw
    if (nodes.length === 0) {
        return 0;
    }

    if (isMax) {
        const maxScores = getMaxScores(nodes, board, symbols);
        const maxScore = Math.max(...maxScores);

        if (depth === 0) {
            const maxIndex = maxScores.indexOf(maxScore);
            return nodes[maxIndex];
        } else {
            return maxScore;
        }
    } else {
        return Math.min(...getMinScores(nodes, board, symbols));
    }
}

function getMaxScores(nodes, board, symbols) {
    return nodes.map(node => {
        const currentNodes = nodes.filter(n => n !== node);
        const currentBoard = [...board];
        currentBoard[node] = symbols.computer;
        return minmax(currentNodes, currentBoard, false, symbols);
    });
}

function getMinScores(nodes, board, symbols) {
    return nodes.map(node => {
        const currentNodes = nodes.filter(n => n !== node);
        const currentBoard = [...board];
        currentBoard[node] = symbols.player;
        return minmax(currentNodes, currentBoard, true, symbols);
    });
}

export default minmaxAlgorithm;