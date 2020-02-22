import getEmptyIndexes from "../shared/getEmptyIndexes";
import checkForWin from "../shared/checkForWin";
import randomAlgorithm from "./random";

function normalAlgorithm(board, { computer, player }) {
    const emptyIndexes = getEmptyIndexes(board);
    let index;

    [computer, player].forEach(symbol => {
        for (let i = 0; i < emptyIndexes.length; i++) {
            const tempBoard = [...board];
            tempBoard[emptyIndexes[i]] = symbol;
            if (checkForWin(tempBoard)) {
                index = emptyIndexes[i];
            }
        }
    });

    return typeof index !== "undefined" ? index : randomAlgorithm(board);
}

export default normalAlgorithm;
